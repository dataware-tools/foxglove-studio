import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../../components/ConfiguredAuth0Provider";
import { AnnotatorForCoMLOpsPromptEngineeringEx2 } from "./content";

type AnnotationPanelForCoMLOpsPromptEngineeringEx2Config = Record<string, never>;

type AnnotationPanelForCoMLOpsPromptEngineeringEx2Props = {
  config: AnnotationPanelForCoMLOpsPromptEngineeringEx2Config;
  saveConfig: SaveConfig<AnnotationPanelForCoMLOpsPromptEngineeringEx2Config>;
};

const AnnotationPanelForCoMLOpsPromptEngineeringEx2 = (
  _props: AnnotationPanelForCoMLOpsPromptEngineeringEx2Props,
) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%">
        <PanelToolbar />
        <Box
          sx={{
            overflowY: "scroll",
          }}
        >
          <AnnotatorForCoMLOpsPromptEngineeringEx2 />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationPanelForCoMLOpsPromptEngineeringEx2Config = {};

export default Panel(
  Object.assign(AnnotationPanelForCoMLOpsPromptEngineeringEx2, {
    panelType: "AnnotationPanelForCoMLOpsPromptEngineeringEx2",
    defaultConfig,
  }),
);
