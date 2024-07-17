import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";

const selectCurrentTime = (ctx: MessagePipelineContext) => ctx.playerState.activeData?.currentTime;

export const useCurrentTime = () => {
  // TODO: debounce get current time to avoid slow performance
  const currentTime = useMessagePipeline(selectCurrentTime);
  const currentTimeInUnixTime = currentTime ? currentTime.sec + currentTime.nsec / 1e9 : undefined;
  return { currentTime, currentTimeInUnixTime };
};
