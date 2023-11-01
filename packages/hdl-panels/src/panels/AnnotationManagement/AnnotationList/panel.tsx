import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../utilComponents/ConfiguredAuth0Provider";
import { ServerAnnotationSync } from "../utilComponents/ServerAnnotationSync";
import { AnnotationList } from "./content";

type AnnotationListPanelConfig = {};

type AnnotationListPanelProps = {
  config: AnnotationListPanelConfig;
  saveConfig: SaveConfig<AnnotationListPanelConfig>;
};

const AnnotationListPanel = (_props: AnnotationListPanelProps) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%">
        <ServerAnnotationSync />
        <PanelToolbar />
        <Box
          sx={{
            overflowY: "scroll",
          }}
        >
          <AnnotationList />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationListPanelConfig = {};

export default Panel(
  Object.assign(AnnotationListPanel, {
    panelType: "AnnotationListPanel",
    defaultConfig,
  }),
);
