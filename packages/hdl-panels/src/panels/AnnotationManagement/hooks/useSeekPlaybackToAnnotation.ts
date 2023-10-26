import { useSeekPlayback } from "../../hooks/useSeekPlayback";
import { Annotation } from "../types";
import { unixtimeToFoxgloveTime } from "../utils";

export const useSeekPlaybackToAnnotation = () => {
  const seekPlayback = useSeekPlayback();

  return (annotation: Annotation) => {
    const seekTime = unixtimeToFoxgloveTime(annotation.timestamp_from);
    // We need to add some value to annotation timestamp.
    // Because foxglove - studio seem to receive a message when player's timestamp passes the message's timestamp in some degree.
    // 100000ns(= 0.0001s) is not appeared in the UI, because timestamp is rounded to 3 decimal places in default config.
    // And normal vehicle video doesn't have 10000 fps.
    // So 100000ns is reasonable magic number to some extent.
    // TODO(t-watanabe): use more reasonable value
    seekPlayback({ sec: seekTime.sec, nsec: seekTime.nsec + 100000 });
  };
};
