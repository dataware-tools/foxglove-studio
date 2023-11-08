import PanelContext from "@foxglove/studio-base/components/PanelContext";
import sendNotification from "@foxglove/studio-base/util/sendNotification";
import { useContext, useMemo, useState } from "react";
import { useAddAnnotation, useServerAnnotations } from "../apiClients";
import { useAnnotationsState } from "../stores/annotation";
import { usePlayerState } from "../stores/player";
import { useCameraTopicState } from "../stores/topic";

export const usePasteAnnotationAction = () => {
  const { request: addAnnotationRequest } = useAddAnnotation();

  const [cameraTopics] = useCameraTopicState((state) => [state.cameraTopics]);
  const parentPanelContext = useContext(PanelContext);
  const panelId = useMemo(() => {
    return parentPanelContext?.id;
  }, [parentPanelContext]);
  const currentCameraTopic = useMemo(
    () => (panelId ? cameraTopics[panelId] : ""),
    [panelId, cameraTopics],
  );

  const startEditing = useAnnotationsState((state) => state.startEditing);

  const { fetchServerAnnotations } = useServerAnnotations();
  const [isPasting, setIsPasting] = useState(false);

  const currentTimeInNumber = usePlayerState((state) => state.currentTimeInNumber);
  const curTimestamp = currentTimeInNumber() || 0;

  const pasteAnnotationAction = async (
    position: { x: number; y: number } | undefined = undefined,
  ) => {
    setIsPasting(true);

    const pastedText = await navigator.clipboard.readText();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pastedObj: any | null = null;
    try {
      pastedObj = JSON.parse(pastedText);
    } catch (e) {
      console.error(e);
      sendNotification("Failed to parse pasted text", pastedText, "user", "error");
      return;
    }
    if (pastedObj === null) {
      return;
    }
    const newAnnotationWithoutId = {
      type: pastedObj?.type ?? "point",
      centerPoint: position ?? pastedObj?.centerPoint ?? { x: 100, y: 100 },
      comment: pastedObj?.comment ?? "comment",
      targetTopic: currentCameraTopic,
      timestamp_from: curTimestamp,
      timestamp_to: curTimestamp,
      generation: pastedObj?.generation ?? 1,
      width: pastedObj?.width ?? undefined,
      height: pastedObj?.height ?? undefined,
      frame_id: pastedObj?.frame_id ?? "",
      instance_id: pastedObj?.instance_id,
    } as Parameters<typeof addAnnotationRequest>[0];

    const [data, error] = await addAnnotationRequest(newAnnotationWithoutId);
    if (error) {
      // TODO(yusukefs): Show error message e.g. snackbar
      console.error(error);
    } else if (data) {
      await fetchServerAnnotations();
      startEditing(data.annotation_id);
    }

    setIsPasting(false);
  };
  return { pasteAnnotationAction, isPasting };
};
