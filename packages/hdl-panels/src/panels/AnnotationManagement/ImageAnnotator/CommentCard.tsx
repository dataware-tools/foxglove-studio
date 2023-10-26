import { useConfirm } from "@foxglove/studio-base/hooks/useConfirm";
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  SwipeLeftAlt
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Badge,
  InputBase,
  Skeleton,
  SxProps,
  Tooltip,
  colors
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Box, alpha } from "@mui/system";
import { animated, useSpring, useSpringRef } from "@react-spring/web";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAddAnnotation,
  useServerAnnotations,
  useUpdateAnnotation,
} from "../apiClients";
import { useCopyAnnotationAction } from "../hooks/useCopyAnnotationAction";
import { useDeleteAnnotationAction } from "../hooks/useDeleteAnnotationAction";
import { useDuplicateAnnotationAction } from "../hooks/useDuplicateAnnotationAction";
import { useSeekPlaybackToAnnotation } from "../hooks/useSeekPlaybackToAnnotation";
import { useAnnotationsState } from "../stores/annotation";
import { useIsAdding } from "../stores/isAdding";
import { usePlayerState } from "../stores/player";
import { Annotation } from "../types";

const COMMENT_CARD_WIDTH = 300;
const COMMENT_CARD_HEIGHT = 72;

type CommentCardMenuProps = {
  items: {
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
    callback: () => void;
  }[];
};
const CommentCardMenu = ({ items }: CommentCardMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        aria-label="more"
        id="card-actions-button"
        aria-controls={open ? "card-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleMenuButtonClick}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        id="card-actions-menu"
        MenuListProps={{
          "aria-labelledby": "card-actions-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        {items.map((item, ikey) => (
          <MenuItem
            key={ikey}
            onClick={() => {
              handleMenuClose();
              item.callback();
            }}
            // TODO(yusukefs): Improve this interaction (maybe saving the duplicated annotation?)
            disabled={item.disabled}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export type CommentCardPresentationProps = {
  annotation: Annotation;
  top: number;
  left: number;
  isLoading: boolean;
  editingHasUpdate: boolean;
  isOnTimestamp: boolean;
  menuItems?: {
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
    callback: () => void;
  }[];
  sx?: SxProps;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onCommentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onInstanceChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitComment: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    comment: string,
    instanceId?: string
  ) => Promise<void>;
  onSeekBack?: () => void;
};

export const CommentCardPresentation = ({
  annotation,
  top,
  left,
  menuItems,
  sx,
  isLoading,
  editingHasUpdate,
  isOnTimestamp,
  onClose,
  onCommentChange,
  onInstanceChange,
  handleSubmitComment,
  onSeekBack,
}: CommentCardPresentationProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [closeButtonHover, setCloseButtonHover] = useState(false);
  const stopPropagation = (
    e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => e.stopPropagation();

  // Set initial value
  useEffect(() => {
    setComment(annotation.comment ?? "");
    setInstanceId(annotation.instance_id ?? "");
  }, [annotation]);

  // Focus input field on mounted
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const CommentCardHeader = useMemo(
    () => (
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CommentCardMenu items={menuItems ?? []} />
        <Stack direction="row">
          {onSeekBack && !isOnTimestamp && (
            <Tooltip title="Seek to original timestamp" placement="top">
              <IconButton size="small" onClick={() => onSeekBack()}>
                <SwipeLeftAlt />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close" placement="top">
            <IconButton
              size="small"
              onClick={(e) => onClose(e)}
              onMouseEnter={() => setCloseButtonHover(true)}
              onMouseLeave={() => setCloseButtonHover(false)}
            >
              {editingHasUpdate && !closeButtonHover ? (
                <FiberManualRecordIcon fontSize="small" />
              ) : (
                <CloseIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    ),
    [
      menuItems,
      onClose,
      editingHasUpdate,
      closeButtonHover,
      isOnTimestamp,
      onSeekBack,
    ]
  );
  const CommentForm = useMemo(() => {
    return (
      <Stack
        direction="row"
        height="100%"
        overflow="auto"
        alignItems="end"
        justifyContent="strech"
        flexGrow={1}
      >
        <Box overflow="scroll" width="100%" height="100%">
          <FormControl fullWidth>
            {/* TODO(yusukefs): Fix warning "Warning: Received `false` for a non-boolean attribute `notched`." */}
            <InputBase
              placeholder="Comment"
              inputRef={inputRef}
              multiline
              value={comment}
              maxRows={5}
              onChange={(e) => {
                onCommentChange(e);
                setComment(e.target.value);
              }}
              sx={{
                height: "100%",
                p: 0.5,
                bgcolor: alpha(colors.grey[50], 0.1),
                borderRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputBase
              placeholder="Tracking instance ID"
              value={instanceId}
              maxRows={5}
              onChange={(e) => {
                onInstanceChange(e);
                setInstanceId(e.target.value);
              }}
              sx={{
                height: "100%",
                p: 0.5,
                bgcolor: alpha(colors.grey[50], 0.1),
                borderRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          </FormControl>
        </Box>
        <Box height="100%">
          <Tooltip
            title={isOnTimestamp ? "" : "Saving with original timestamps"}
          >
            <Badge
              variant="dot"
              color="secondary"
              overlap="circular"
              invisible={isOnTimestamp}
            >
              <IconButton
                size="small"
                aria-label="submit"
                color="primary"
                disabled={comment.length === 0}
                onClick={(e) => {
                  handleSubmitComment(e, comment, instanceId);
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            </Badge>
          </Tooltip>
        </Box>
      </Stack>
    );
  }, [
    handleSubmitComment,
    onCommentChange,
    comment,
    onInstanceChange,
    instanceId,
    isOnTimestamp,
    inputRef,
  ]);
  return (
    <>
      <Paper
        elevation={8}
        onPointerDown={stopPropagation}
        onPointerUp={stopPropagation}
        onPointerMove={stopPropagation}
        onClick={stopPropagation}
        ref={cardRef}
        sx={{
          width: COMMENT_CARD_WIDTH,
          position: "relative",
          p: 0.5,
          top,
          left,
          cursor: "default",
          pointerEvents: "auto",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "strecth",
          alignItems: "stretch",
          ...sx,
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            my={1}
          >
            <Skeleton width={100} />
          </Box>
        ) : (
          <Stack spacing={0.5}>
            {CommentCardHeader}
            {CommentForm}
          </Stack>
        )}
      </Paper>
    </>
  );
};

export type CommentCardProps = {
  annotationId: string;
  commentAreaCenterX: number;
  commentAreaCenterY: number;
  commentAreaHeight: number;
  spaceWidth: number;
  spaceHeight: number;
  sx?: SxProps;
};

export const CommentCard = ({
  annotationId,
  commentAreaCenterX,
  commentAreaCenterY,
  commentAreaHeight,
  spaceWidth,
  spaceHeight,
}: CommentCardProps) => {
  const [annotation, setAnnotation] = useState<Annotation | null>(null);
  const currentTimeInNumber = usePlayerState(
    (state) => state.currentTimeInNumber
  );
  const curTimestamp = currentTimeInNumber() || 0;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardHeight = useMemo(() => {
    if (cardRef.current === null) return COMMENT_CARD_HEIGHT;
    const height = cardRef.current.offsetHeight;
    return height;
  }, [cardRef.current?.offsetHeight]);
  const confirm = useConfirm();

  // Focus input field on mounted
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // Update comment related
  const updateAnnotation = useAnnotationsState(
    (state) => state.updateAnnotation
  );
  const updateEditingAnnotation = useAnnotationsState(
    (state) => state.updateEditingAnnotation
  );
  const getAnnotation = useAnnotationsState((state) => state.getAnnotation);
  const editingHasUpdate = useAnnotationsState(
    (state) => state.editingHasUpdate
  );
  const isNewlyAddingAnnotation = useAnnotationsState(
    (state) => state.isNewlyAddingAnnotation
  );
  const editingAnnotation = useAnnotationsState(
    (state) => state.editingAnnotation
  );
  const isOnTimestamp = useMemo(() => {
    if (!editingAnnotation) return false;
    const isAnnotationTimePoint =
      editingAnnotation.timestamp_from === editingAnnotation.timestamp_to;
    if (isAnnotationTimePoint) {
      const timestamp = editingAnnotation.timestamp_from;
      return timestamp
        ? curTimestamp - timestamp < 0.1 && curTimestamp - timestamp >= 0
        : false;
    } else {
      // TODO(t-watanabe): Support annotation with duration
      return true;
    }
  }, [editingAnnotation, curTimestamp]);

  const isSeeking = usePlayerState((state) => state.isSeeking);
  const setIsSeeking = usePlayerState((state) => state.setIsSeeking);
  useEffect(() => {
    if (isSeeking && isOnTimestamp) {
      setIsSeeking(false);
    }
  }, [isSeeking, setIsSeeking, isOnTimestamp]);

  const { request: addAnnotationRequest } = useAddAnnotation();
  const { request: updateAnnotationRequest } = useUpdateAnnotation();
  const { fetchServerAnnotations } = useServerAnnotations();
  const stopEditing = useAnnotationsState((state) => state.stopEditing);
  const incrementGeneration = useAnnotationsState(
    (state) => state.incrementGeneration
  );
  const stopAdding = useIsAdding((state) => state.stopAdding);
  const handleSubmitComment = async (value: string, instanceId?: string) => {
    if (!editingAnnotation) return;

    const commentHasUpdate = editingAnnotation.comment !== value;

    const newAnnotation = {
      ...editingAnnotation,
      timestamp_from: curTimestamp,
      timestamp_to: curTimestamp,
      comment: value,
      instance_id: instanceId,
    };
    updateAnnotation(editingAnnotation.id, newAnnotation);
    stopEditing();
    stopAdding();

    if (isNewlyAddingAnnotation(editingAnnotation.id)) {
      // Request API to add comment if it has the prefix
      const [data, error] = await addAnnotationRequest(newAnnotation);
      if (error) {
        console.error(error);
        await confirm({ title: "Failed to create annotation" });
      } else if (data) {
        // Update annotation id
        updateAnnotation(annotationId, { id: data.annotation_id });
      }
      await fetchServerAnnotations();
    } else if (commentHasUpdate || editingHasUpdate || !isOnTimestamp) {
      // Request API to update comment if the comment or annotation geometry has update
      incrementGeneration(editingAnnotation.id);
      const [, error] = await updateAnnotationRequest(
        editingAnnotation.id,
        newAnnotation
      );
      if (error) {
        console.error(error);
        await confirm({ title: "Failed to update annotation" });
      }
      await fetchServerAnnotations();
    }
  };

  // Close button related
  const isAdding = useIsAdding((state) => state.isAdding);
  const removeAnnotation = useAnnotationsState(
    (state) => state.removeAnnotation
  );

  // Set initial value
  useEffect(() => {
    const annotation = getAnnotation(annotationId);
    setAnnotation(annotation);
  }, [annotationId, getAnnotation]);

  // Calculate position of comment card
  const top = useMemo(() => {
    // Place card inside the comment area if height of the comment area is too large
    if (commentAreaHeight > spaceHeight - cardHeight - 100) {
      return commentAreaCenterY + commentAreaHeight / 2 - cardHeight - 10;
    }

    // Place card above the comment area if the center point of the comment area
    // is in the lower half of the space, otherwise place it below
    if (commentAreaCenterY > spaceHeight / 2) {
      return commentAreaCenterY - commentAreaHeight / 2 - cardHeight - 10;
    } else {
      return commentAreaCenterY + commentAreaHeight / 2 + 10;
    }
  }, [commentAreaCenterY, commentAreaHeight, spaceHeight, cardHeight]);

  const left = useMemo(() => {
    // Place card to the left of the comment area if the center point of the comment area
    // is in the right half of the space, otherwise place it to the right
    if (commentAreaCenterX > spaceWidth / 2) {
      return commentAreaCenterX - COMMENT_CARD_WIDTH;
    } else {
      return commentAreaCenterX;
    }
  }, [commentAreaCenterX, spaceWidth]);

  const { duplicateAnnotationAction } = useDuplicateAnnotationAction();
  const { deleteAnnotationAction } = useDeleteAnnotationAction();
  const { copyAnnotationAction } = useCopyAnnotationAction();

  const menuItems = useMemo(
    () => [
      {
        label: "Duplicate",
        icon: <ContentCopyIcon fontSize="small" />,
        disabled: true,
        callback: () => {
          annotation && duplicateAnnotationAction(annotation.id);
        },
      },
      {
        label: "Copy",
        icon: <ContentCopyIcon fontSize="small" />,
        callback: () => {
          annotation && copyAnnotationAction(annotation.id);
        },
      },
      {
        label: "Delete",
        icon: <DeleteIcon fontSize="small" />,
        disabled: false,
        callback: () => {
          annotation && deleteAnnotationAction(annotation);
        },
      },
    ],
    [
      annotation,
      duplicateAnnotationAction,
      deleteAnnotationAction,
      copyAnnotationAction,
    ]
  );

  // For animation
  const api = useSpringRef();
  const { x } = useSpring({
    ref: api,
    from: { x: 0 },
    to: { x: 1 },
    reset: true,
  });
  const shakeXStart = -5;
  const shakeXEnd = 5;
  // NOTE(yusukefs): Interpolate x value to make the card shake smoothly
  // Reference: https://github.com/pmndrs/react-spring/discussions/1746#discussioncomment-1621062
  const xInterpolate = x.to(
    [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
    // prettier-ignore
    [shakeXStart, shakeXEnd, shakeXStart, shakeXEnd, shakeXStart, shakeXEnd, shakeXStart, shakeXEnd,
    ]
  );
  const triggerShakingAnimation = useAnnotationsState(
    (state) => state.triggerShakingAnimation
  );
  const setTriggerShakingAnimation = useAnnotationsState(
    (state) => state.setTriggerShakingAnimation
  );
  useEffect(() => {
    if (triggerShakingAnimation) {
      api.start();
      setTriggerShakingAnimation(false);
    }
  }, [api, triggerShakingAnimation, setTriggerShakingAnimation]);

  const handleClose = useCallback(async () => {
    if (editingHasUpdate) {
      const response = await confirm({
        title: `Do you want to discard changes you made to this annotation?`,
        prompt: "This action cannot be undone.",
        ok: "Discard changes",
        variant: "danger",
      });
      if (response !== "ok") return;
    }
    if (isAdding) {
      removeAnnotation(annotationId);
    }
    stopEditing();
  }, [
    editingHasUpdate,
    isAdding,
    removeAnnotation,
    annotationId,
    stopEditing,
    confirm,
  ]);
  const seekPlaybackToAnnotation = useSeekPlaybackToAnnotation();

  return (
    <animated.div
      style={{
        x: xInterpolate,
        // NOTE(yusukefs): Set width and height to 0 to prevent the card from
        // blocking pointer events
        width: 0,
        height: 0,
      }}
    >
      {annotation && (
        <CommentCardPresentation
          annotation={annotation}
          top={top}
          left={left}
          isLoading={isSeeking}
          editingHasUpdate={editingHasUpdate}
          menuItems={menuItems}
          isOnTimestamp={isOnTimestamp}
          handleSubmitComment={async (_e, value, instanceId) => {
            handleSubmitComment(value, instanceId);
          }}
          onCommentChange={(e) => {
            updateEditingAnnotation({ comment: e.target.value });
          }}
          onInstanceChange={(e) => {
            updateEditingAnnotation({ instance_id: e.target.value });
          }}
          onClose={() => {
            handleClose();
          }}
          onSeekBack={() => {
            seekPlaybackToAnnotation(annotation);
          }}
        />
      )}
    </animated.div>
  );
};
