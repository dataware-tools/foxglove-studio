// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { StoryObj } from "@storybook/react";

import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";

import HDLSamplePanel from "./index";

export default {
  title: "HDLPanels/HDLSamplePanel",
  component: HDLSamplePanel,
};

export const Example: StoryObj = {
  render: () => {
    return (
      <PanelSetup>
        <HDLSamplePanel />
      </PanelSetup>
    );
  },
};
