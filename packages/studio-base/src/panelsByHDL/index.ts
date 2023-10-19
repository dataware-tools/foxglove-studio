// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { PanelInfo } from "@foxglove/studio-base/context/PanelCatalogContext";

export const getHDLDeveloped: () => PanelInfo[] = () => [
  {
    title: "HDLSample",
    type: "HDLSample",
    description: "HDLによるサンプルパネルです。",
    module: async () => await import("./Sample"),
  },
];
