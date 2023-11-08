// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PanelExtensionContext } from "@foxglove/studio";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelExtensionAdapter from "@foxglove/studio-base/components/PanelExtensionAdapter";
import ThemeProvider from "@foxglove/studio-base/theme/ThemeProvider";
import { SaveConfig } from "@foxglove/studio-base/types/panels";
import L from "leaflet";
import LeafletRetinaIconUrl from "leaflet/dist/images/marker-icon-2x.png";
import LeafletIconUrl from "leaflet/dist/images/marker-icon.png";
import LeafletShadowIconUrl from "leaflet/dist/images/marker-shadow.png";
import { StrictMode } from "react";
import ReactDOM from "react-dom";

import MapPanel from "./MapPanel";
import helpContent from "./index.help.md";

import "leaflet/dist/leaflet.css";

// Webpack and leaflet don't work well out of the box without manually
// overriding the default icon and its asset paths.
L.Marker.prototype.options.icon = L.icon({
  iconUrl: LeafletIconUrl,
  iconRetinaUrl: LeafletRetinaIconUrl,
  shadowUrl: LeafletShadowIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function initPanel(context: PanelExtensionContext) {
  ReactDOM.render(
    <StrictMode>
      <ThemeProvider isDark>
        <MapPanel context={context} />
      </ThemeProvider>
    </StrictMode>,
    context.panelElement,
  );
}

type Props = {
  config: unknown;
  saveConfig: SaveConfig<unknown>;
};

function MapPanelAdapter(props: Props) {
  return (
    <PanelExtensionAdapter
      config={props.config}
      saveConfig={props.saveConfig}
      help={helpContent}
      initPanel={initPanel}
    />
  );
}

MapPanelAdapter.panelType = "HDLMap";
MapPanelAdapter.defaultConfig = {};

export default Panel(MapPanelAdapter);
