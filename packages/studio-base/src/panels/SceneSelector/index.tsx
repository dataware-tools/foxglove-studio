import styled from "styled-components";

import { useRosLib, SceneSelector, PinLocations } from "scene-viewer-panels";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import useGlobalVariables from "@foxglove/studio-base/hooks/useGlobalVariables";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const params = new URLSearchParams(window.location.search);
const websocketUrl = params.get("ds.url") ?? "ws://localhost:9090";

function SceneSelectorPanel() {
  const { captionsWithLocation, seekToTimestamp } = useRosLib({
    websocketUrl,
    topicNames: ["/scene_viewer/scene_captions_with_locations"],
  });
  const { setGlobalVariables } = useGlobalVariables();

  const setPinLocations = React.useCallback(
    (pinLocations: PinLocations) => {
      setGlobalVariables({ pinLocations });
    },
    [setGlobalVariables],
  );
  const captions = React.useMemo(
    () =>
      captionsWithLocation.map((item) => {
        return {
          timestamp: item.timestamp,
          caption: item.caption,
          location: {
            altitude: item.altitude,
            latitude: item.latitude,
            longitude: item.longitude,
          },
        };
      }),
    [captionsWithLocation],
  );

  return (
    <Container>
      <PanelToolbar floating />
      <SceneSelector
        captions={captions}
        setPinLocations={setPinLocations}
        onSelectScene={(timestamp) => {
          seekToTimestamp(timestamp);
        }}
      />
    </Container>
  );
}

SceneSelectorPanel.panelType = "SceneSelectorPanel";
SceneSelectorPanel.defaultConfig = {};

export default Panel(SceneSelectorPanel);
