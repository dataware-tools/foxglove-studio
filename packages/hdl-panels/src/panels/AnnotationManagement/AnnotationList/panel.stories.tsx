import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";
import { Box } from "@mui/system";
import { AnnotationList } from "./content";

export default {
  title: "HDLPanels/AnnotationList",
  component: AnnotationList,
};

export function Default(): JSX.Element {
  return (
    <PanelSetup>
      <Box sx={{ width: 400, height: 300 }}>
        <AnnotationList />
      </Box>
    </PanelSetup>
  );
}
