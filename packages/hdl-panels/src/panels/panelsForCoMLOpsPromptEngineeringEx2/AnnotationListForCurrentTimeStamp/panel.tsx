import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ConfiguredAuth0Provider } from "../../../components/ConfiguredAuth0Provider";
import { tagOptionsForEachTagType } from "../defaultConfig";
import { TagOptionsForEachTagType } from "../types";
import { AnnotationListForCurrentTimestamp } from "./content";

export type AnnotationListPanelForCurrentTimestampConfig = {
  tagOptionsForEachTagType: TagOptionsForEachTagType;
};

type AnnotationListPanelForCurrentTimestampProps = {
  config: AnnotationListPanelForCurrentTimestampConfig;
  saveConfig: SaveConfig<AnnotationListPanelForCurrentTimestampConfig>;
};

const AnnotationListPanelForCurrentTimestamp = ({
  config,
}: AnnotationListPanelForCurrentTimestampProps) => {
  return (
    <ConfiguredAuth0Provider>
      <Stack flex="auto" width="100%" height="100%" overflow="hidden">
        <PanelToolbar />
        <Box overflow="hidden" height={"100%"}>
          <AnnotationListForCurrentTimestamp config={config} />
        </Box>
      </Stack>
    </ConfiguredAuth0Provider>
  );
};

const defaultConfig: AnnotationListPanelForCurrentTimestampConfig = {
  tagOptionsForEachTagType: tagOptionsForEachTagType,
};

export default Panel(
  Object.assign(AnnotationListPanelForCurrentTimestamp, {
    panelType: "AnnotationListPanelForCurrentTimestamp",
    defaultConfig,
  }),
);
