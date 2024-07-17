import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../../../components/ConfiguredAuth0Provider";
import { AnnotationInput } from "./content";

type AnnotationListPanelForOneTagTypeConfig = Record<string, never>;

type AnnotationListPanelForOneTagTypeProps = {
  config: AnnotationListPanelForOneTagTypeConfig;
  saveConfig: SaveConfig<AnnotationListPanelForOneTagTypeConfig>;
};

const AnnotationListPanelForOneTagType = (_props: AnnotationListPanelForOneTagTypeProps) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%" overflow="hidden">
        <PanelToolbar />
        <Box overflow="hidden" height={"100%"}>
          <AnnotationInput />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationListPanelForOneTagTypeConfig = {};

export default Panel(
  Object.assign(AnnotationListPanelForOneTagType, {
    panelType: "AnnotationListPanelForOneTagType",
    defaultConfig,
  }),
);
