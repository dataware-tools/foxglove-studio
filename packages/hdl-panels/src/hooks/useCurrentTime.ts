import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import { foxgloveTimeToUnixTime } from "../logics/time";

const selectCurrentTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.currentTime;

export const useCurrentTime = () => {
  // TODO: debounce get current time to avoid slow performance
  const currentTime = useMessagePipeline(selectCurrentTime);
  const currentTimeInUnixTime = currentTime ? foxgloveTimeToUnixTime(currentTime) : undefined;
  return { currentTime, currentTimeInUnixTime };
};
