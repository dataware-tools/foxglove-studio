import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import { Box } from "@mui/system";
import { FoxGloveThemeProvider } from "../../../utils/ThemeProvider";
import { ConfiguredAuth0Provider } from "../utilComponents/ConfiguredAuth0Provider";
import { ServerAnnotationSync } from "../utilComponents/ServerAnnotationSync";
import { AnnotationList } from "./content";

const MIN_PANEL_WIDTH = 400;
const MIN_PANEL_HEIGHT = 200;

type AnnotationListPanelConfig = {};

type AnnotationListPanelProps = {
  config: AnnotationListPanelConfig;
  saveConfig: SaveConfig<AnnotationListPanelConfig>;
};

const AnnotationListPanel = (_props: AnnotationListPanelProps) => {
  return (
    <FoxGloveThemeProvider>
      <ConfiguredAuth0Provider>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            pt: 3,
          }}
          minHeight={MIN_PANEL_HEIGHT}
          minWidth={MIN_PANEL_WIDTH}
          overflow="scroll"
        >
          <ServerAnnotationSync />
          <PanelToolbar />
          <AnnotationList />
        </Box>
      </ConfiguredAuth0Provider>
    </FoxGloveThemeProvider>
  );
};

const defaultConfig: AnnotationListPanelConfig = {};

export default Panel(
  Object.assign(AnnotationListPanel, {
    panelType: "AnnotationListPanel",
    defaultConfig,
  }),
);
