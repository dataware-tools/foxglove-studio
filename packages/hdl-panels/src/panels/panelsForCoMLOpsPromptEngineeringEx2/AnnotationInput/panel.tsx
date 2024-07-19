import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../../../components/ConfiguredAuth0Provider";
import { tagOptionsForEachTagType } from "../defaultConfig";
import { AnnotationInput, AnnotationInputPanelConfig } from "./content";

type AnnotationInputPanelProps = {
  config: AnnotationInputPanelConfig;
  saveConfig: SaveConfig<AnnotationInputPanelConfig>;
};

const AnnotationInputPanel = ({ config }: AnnotationInputPanelProps) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%" overflow="hidden">
        <PanelToolbar />
        <Box overflow="hidden" height={"100%"}>
          <AnnotationInput config={config} />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationInputPanelConfig = {
  tagOptionsForEachTagType: tagOptionsForEachTagType,
};

export default Panel(
  Object.assign(AnnotationInputPanel, {
    panelType: "AnnotationInputPanel",
    defaultConfig,
  }),
);
