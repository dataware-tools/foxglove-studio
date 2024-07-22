import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../../../components/ConfiguredAuth0Provider";
import { tagOptionsForEachTagType } from "../defaultConfig";
import { AnnotationListForTagType, AnnotationListPanelForTagTypeConfig } from "./content";

type AnnotationListPanelForTagTypeProps = {
  config: AnnotationListPanelForTagTypeConfig;
  saveConfig: SaveConfig<AnnotationListPanelForTagTypeConfig>;
};

const AnnotationListPanelForTagType = ({ config }: AnnotationListPanelForTagTypeProps) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%" overflow="hidden">
        <PanelToolbar />
        <Box overflow="hidden" height={"100%"}>
          <AnnotationListForTagType config={config} />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationListPanelForTagTypeConfig = {
  tagOptionsForEachTagType: tagOptionsForEachTagType,
};

export default Panel(
  Object.assign(AnnotationListPanelForTagType, {
    panelType: "AnnotationListPanelForTagType",
    defaultConfig,
  }),
);
