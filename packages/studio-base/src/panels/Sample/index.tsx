// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";

function Sample() {
  return (
    <div style={{ padding: "25px 4px 4px" }}>
      <PanelToolbar>
        <div>sample</div>
      </PanelToolbar>
    </div>
  );
}

Sample.panelType = "Sample";
Sample.defaultConfig = {};

export default Panel(Sample);
