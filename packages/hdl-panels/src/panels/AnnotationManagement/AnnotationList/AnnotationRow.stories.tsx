import MockMessagePipelineProvider from "@foxglove/studio-base/components/MessagePipeline/MockMessagePipelineProvider";
import { Box } from "@mui/system";
import { RefObject } from "react";
import { FoxGloveThemeProvider } from "../../../utils/ThemeProvider";
import { Point } from "../types";
import { AnnotationRow } from "./AnnotationRow";
import { AnnotationList } from "./content";

export default {
  title: "HDLComponents/AnnotationRow",
  component: AnnotationList,
};
export function Default(): JSX.Element {
  // NOTE (onose004): This is a dummy function to prevent the error
  const setRef = (ref: RefObject<HTMLTableRowElement>, annotationId: string) => {
    console.log(ref, annotationId);
  };
  return (
    <FoxGloveThemeProvider>
      <MockMessagePipelineProvider>
        <Box sx={{ width: 500, height: 300 }}>
          <AnnotationRow
            setRef={setRef}
            annotation={{
              index: 0,
              id: "id_1",
              type: "rect",
              centerPoint: new Point(0, 0),
              comment: "test comment",
              targetTopic: "topic_1",
              generation: 0,
              frame_id: "frame_id_1",
              timestamp_from: 0,
              timestamp_to: 0,
            }}
            highlightedTexts={[]}
          />
        </Box>
      </MockMessagePipelineProvider>
    </FoxGloveThemeProvider>
  );
}
