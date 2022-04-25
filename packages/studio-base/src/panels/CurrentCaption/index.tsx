// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import styled from "styled-components";

import { useRosLib, CurrentCaption } from "scene-viewer-panels";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const params = new URLSearchParams(window.location.search);
const websocketUrl = params.get("ds.url") ?? "ws://localhost:9090";

function CurrentCaptionPanel(): JSX.Element {
  const { captions, seekToTimestamp, currentTime } = useRosLib({
    websocketUrl,
    topicNames: ["/scene_viewer/scene_captions", "/clock"],
  });
  return (
    <Container>
      <PanelToolbar floating />
      <CurrentCaption
        onChangeScene={({ timestamp }) => seekToTimestamp(timestamp)}
        currentTimestamp={currentTime}
        captions={captions}
      />
    </Container>
  );
}

CurrentCaptionPanel.panelType = "CurrentCaptionPanel";
CurrentCaptionPanel.defaultConfig = {};

export default Panel(CurrentCaptionPanel);
