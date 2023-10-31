import { useDataSourceInfo } from "@foxglove/studio-base/PanelAPI";
import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelContext from "@foxglove/studio-base/components/PanelContext";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { useConfirm } from "@foxglove/studio-base/hooks/useConfirm";
import { TopicDropdown } from "../ImageView/components/TopicDropdown";
import { useImagePanelMessages } from "../ImageView/hooks/useImagePanelMessages";
import { NORMALIZABLE_IMAGE_DATATYPES } from "../ImageView/lib/normalizeMessage";
import { NormalizedImageMessage } from "../ImageView/types";
import { AddComment as AddCommentIcon, Clear as ClearIcon } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FoxGloveThemeProvider } from "../../../utils/ThemeProvider";
import { useAnnotationsState } from "../stores/annotation";
import { useIsAdding } from "../stores/isAdding";
import { usePlayerState } from "../stores/player";
import { useCameraTopicState } from "../stores/topic";
import { ConfiguredAuth0Provider } from "../utilComponents/ConfiguredAuth0Provider";
import { ServerAnnotationSync } from "../utilComponents/ServerAnnotationSync";
import { ImageAnnotationCanvas, ImageAnnotationCanvasProps } from "./ImageAnnotationCanvas";

const MIN_PANEL_WIDTH = 400;
const MIN_PANEL_HEIGHT = 200;

export type ImageAnnotatorPanelPresentationProps = {
  image?: NormalizedImageMessage;
  onStartRenderImage?: ImageAnnotationCanvasProps["onStartRenderImage"];
  hideAnnotations?: boolean;
};

export const ImageAnnotatorPanelPresentation = ({
  image,
  onStartRenderImage,
  hideAnnotations,
}: ImageAnnotatorPanelPresentationProps) => {
  return (
    <>
      {image && (
        <ImageAnnotationCanvas
          image={image}
          onStartRenderImage={onStartRenderImage}
          hideAnnotations={hideAnnotations}
        />
      )}
    </>
  );
};

// NOTE(yusukefs): This initialization needs to be done outside of the component to prevent re-rendering
const annotationTopics: string[] = [];

const ImageAnnotatorPanel = () => {
  const [cameraTopics, setCameraTopics] = useCameraTopicState((state) => [
    state.cameraTopics,
    state.setCameraTopic,
  ]);
  const parentPanelContext = useContext(PanelContext);
  const panelId = useMemo(() => {
    return parentPanelContext?.id;
  }, [parentPanelContext]);
  const currentCameraTopic = useMemo(
    () => (panelId ? cameraTopics[panelId] ?? "" : ""),
    [panelId, cameraTopics],
  );

  const { image } = useImagePanelMessages({
    imageTopic: currentCameraTopic,
    annotationTopics,
    synchronize: false,
  });

  const { topics } = useDataSourceInfo();

  const allImageTopics = useMemo(() => {
    return topics.filter(({ datatype }) => NORMALIZABLE_IMAGE_DATATYPES.includes(datatype));
  }, [topics]);

  // Set the first image topic if cameraTopic is not selected
  useEffect(() => {
    if (allImageTopics[0] && allImageTopics[0].name !== "") {
      panelId && setCameraTopics(panelId, allImageTopics[0].name);
    }
  }, [allImageTopics, setCameraTopics, panelId]);

  const lastImageMessageRef = useRef(image);
  if (image) {
    lastImageMessageRef.current = image;
  }
  const imageMessageToRender = image ?? lastImageMessageRef.current;

  const pauseFrame = useMessagePipeline(
    useCallback((messagePipeline) => messagePipeline.pauseFrame, []),
  );
  const onStartRenderImage = useCallback(() => {
    // NOTE: Absent of this line makes the app so slow, but editing the arg of pauseFrame
    // doesn't change anything. It seems the arg is not actually used.
    const resumeFrame = pauseFrame("CommentManagement");
    const onFinishRenderImage = () => {
      resumeFrame();
    };
    return onFinishRenderImage;
  }, [pauseFrame]);

  const imageTopicDropdown = useMemo(() => {
    const items = allImageTopics.map((topic) => {
      return {
        name: topic.name,
        selected: topic.name === currentCameraTopic,
      };
    });

    const onChange = (newTopics: string[]) => {
      const newTopic = newTopics[0];
      if (newTopic) {
        panelId && setCameraTopics(panelId, newTopic);
      }
    };

    const title =
      currentCameraTopic !== ""
        ? currentCameraTopic
        : items.length === 0
        ? "No camera topics"
        : "Select a camera topic";

    return <TopicDropdown multiple={false} title={title} items={items} onChange={onChange} />;
  }, [currentCameraTopic, setCameraTopics, allImageTopics, panelId]);

  // CurrentTime should be receiveTime of the image message that is being shown in this panel.
  // Because when user playback to the timestamp an annotation have, this panel must show exact image the annotation links
  const messages = useMessagePipeline((ctx) => ctx.playerState.activeData?.messages);
  const imageMessages = messages?.filter((message) => message.topic === currentCameraTopic) || [];
  const currentImageMessage = imageMessages[imageMessages.length - 1];
  const currentImageMessageTime = currentImageMessage?.receiveTime;

  const setCurrentTime = usePlayerState((state) => state.setCurrentTime);
  useEffect(() => {
    if (currentImageMessageTime) {
      setCurrentTime(currentImageMessageTime);
    }
  }, [currentImageMessageTime, setCurrentTime]);
  const isPlaying = useMessagePipeline(
    (ctx: MessagePipelineContext) => ctx.playerState.activeData?.isPlaying,
  );
  const setIsPlaying = usePlayerState((state) => state.setIsPlaying);
  useEffect(() => {
    if (isPlaying) {
      setIsPlaying(isPlaying);
    }
  }, [isPlaying, setIsPlaying]);

  // Manage hide annotations state
  const [hideAnnotations, setHideAnnotations] = useState(false);
  const hideAnnotationsTooltipComment = hideAnnotations ? "Show annotations" : "Hide annotations";

  const isAdding = useIsAdding((state) => state.isAdding);
  const startAdding = useIsAdding((state) => state.startAdding);
  const stopAdding = useIsAdding((state) => state.stopAdding);
  const stopEditing = useAnnotationsState((state) => state.stopEditing);
  const editingAnnotationId = useAnnotationsState((state) => state.editingAnnotationId);
  const removeAnnotation = useAnnotationsState((state) => state.removeAnnotation);
  const [confirm, confirmModal] = useConfirm();

  const handleClick = useCallback(async () => {
    if (editingAnnotationId) {
      const response = await confirm({
        title: `Do you want to discard changes you made to this annotation?`,
        prompt: "This action cannot be undone.",
        ok: "Discard changes",
        variant: "danger",
      });
      if (response !== "ok") return;
    }
    if (isAdding) {
      stopAdding();

      // Remove newly creating annotation if it exists
      if (editingAnnotationId) {
        removeAnnotation(editingAnnotationId);
        stopEditing();
      }
    } else {
      startAdding();
    }
  }, [
    confirm,
    editingAnnotationId,
    isAdding,
    removeAnnotation,
    startAdding,
    stopAdding,
    stopEditing,
  ]);
  // Disable button if camera topic is not selected, or if there is an editing existing annotation
  const disabled = currentCameraTopic === "" || (!isAdding && editingAnnotationId !== null);

  return (
    <FoxGloveThemeProvider>
      <ConfiguredAuth0Provider>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          minHeight={MIN_PANEL_HEIGHT}
          minWidth={MIN_PANEL_WIDTH}
          overflow="scroll"
        >
          <ServerAnnotationSync />
          {confirmModal}
          {/* TODO(yusukefs): Show toolbar always if necessary */}
          <PanelToolbar>
            <Stack
              spacing={1}
              direction="row"
              justifyContent="space-between"
              sx={{
                flexWrap: "wrap",
                flex: "1 1 auto",
              }}
            >
              <Stack spacing={1} direction="row">
                {imageTopicDropdown}
                <Tooltip title={hideAnnotationsTooltipComment}>
                  <IconButton
                    aria-label={hideAnnotationsTooltipComment}
                    size="medium"
                    onClick={() => {
                      setHideAnnotations(!hideAnnotations);
                    }}
                  >
                    {hideAnnotations ? (
                      <VisibilityOffIcon fontSize="inherit" />
                    ) : (
                      <VisibilityIcon fontSize="inherit" />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack spacing={1} direction="row">
                <Tooltip title={isAdding ? "Cancel" : "Add comment"}>
                  <Button
                    disabled={disabled}
                    size="small"
                    color={isAdding ? "error" : "primary"}
                    variant="contained"
                    startIcon={isAdding ? <ClearIcon /> : <AddCommentIcon />}
                    onClick={handleClick}
                  >
                    {isAdding ? "Cancel" : "Comment"}
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          </PanelToolbar>
          {imageMessageToRender && (
            <ImageAnnotatorPanelPresentation
              image={imageMessageToRender}
              onStartRenderImage={onStartRenderImage}
              hideAnnotations={hideAnnotations}
            />
          )}
        </Box>
      </ConfiguredAuth0Provider>
    </FoxGloveThemeProvider>
  );
};

ImageAnnotatorPanel.panelType = "CommentManagementPanel";
ImageAnnotatorPanel.defaultConfig = {};

const Wrapped = Panel(ImageAnnotatorPanel);

export { Wrapped as ImageAnnotator };
