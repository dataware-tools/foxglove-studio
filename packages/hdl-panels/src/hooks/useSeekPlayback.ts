import { Time } from "@foxglove/studio";
import { useMessagePipeline } from "@foxglove/studio-base/components/MessagePipeline";
import { useCallback } from "react";
import { usePlayerState } from "../panels/AnnotationManagement/stores/player";

export const useSeekPlayback = () => {
  const rawSeekPlayback = useMessagePipeline((ctx) => ctx.seekPlayback);
  const setIsSeeking = usePlayerState((state) => state.setIsSeeking);
  const seekPlayback = useCallback(
    (time: Time) => {
      if (rawSeekPlayback) {
        rawSeekPlayback(time);
        setIsSeeking(true);
      }
    },
    [rawSeekPlayback, setIsSeeking],
  );
  return seekPlayback;
};
