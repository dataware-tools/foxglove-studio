// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { MessageEvent } from "@foxglove/studio-base/players/types";
import {
  Map,
  LatLngBounds,
  FeatureGroup,
  CircleMarker,
  PathOptions,
  Ellipse,
  tooltip,
  latLng,
} from "leaflet";
import "leaflet-ellipse";

import { Annotation } from "../AnnotationManagement/types";
import { getAccuracy } from "./getAccuracy";
import { NavSatFixMsg } from "./types";
import { getLastIndexBeforeTime } from "./utils";

export const POINT_MARKER_RADIUS = 5;

type Args = {
  map: Map;
  bounds: LatLngBounds;
  color: string;
  hoverColor: string;
  showAccuracy?: boolean;
  navSatMessageEvents: readonly MessageEvent<NavSatFixMsg>[];
  onHover?: (event: MessageEvent<NavSatFixMsg> | undefined) => void;
  onClick?: (event: MessageEvent<NavSatFixMsg>) => void;
  annotations?: Annotation[];
};

class PointMarker extends CircleMarker {
  public messageEvent?: MessageEvent<NavSatFixMsg>;
}

/**
 * Create a leaflet LayerGroup with filtered points
 */
function FilteredPointLayer(args: Args): FeatureGroup {
  const { navSatMessageEvents: points, bounds, map, annotations } = args;
  const defaultStyle: PathOptions = {
    stroke: false,
    color: args.color,
    fillOpacity: 1,
  };

  const markersLayer = new FeatureGroup();

  const localBounds = bounds;

  // track which pixels have been used
  const sparse2d: (boolean | undefined)[][] = [];

  // Derive the times of the points
  const timesAtPositions: number[] = points.map((point) => {
    // @ts-expect-error message may have header
    return point.message.header?.stamp?.sec + point.message.header?.stamp?.nsec / 1e9;
  });
  // Initialize the map from point index to annotation index
  const pointToAnnotationMap: Record<number, number> = {};
  // Add the annotation tooltips
  annotations &&
    annotations.forEach((annotation, annotationIndex) => {
      // Get indices of points that are in the annotation time range
      const positionIndicesInAnnotation = timesAtPositions
        .map((time, index) =>
          annotation.timestamp_from < time && time < annotation.timestamp_to ? index : undefined,
        )
        .filter((index) => index !== undefined);

      // If there are no points in the annotation time range, use the latest point before the annotation.
      const positionIndicesForAnnotation =
        positionIndicesInAnnotation.length > 0
          ? positionIndicesInAnnotation
          : // Limit the search to 1 second before the annotation
            [getLastIndexBeforeTime(timesAtPositions, annotation.timestamp_from, 1)];

      // Bind the annotation index to the point index
      positionIndicesForAnnotation.forEach((pointIndex) => {
        pointIndex !== undefined && (pointToAnnotationMap[pointIndex] = annotationIndex);
      });

      // Add the permanent tooltip to the point
      const firstPointIndex = positionIndicesForAnnotation[0];
      if (firstPointIndex === undefined) {
        return;
      }
      const firstPoint = points[firstPointIndex];
      if (firstPoint === undefined) {
        return;
      }
      const lat = firstPoint.message.latitude;
      const lon = firstPoint.message.longitude;
      tooltip({ permanent: true, direction: "top" })
        .setLatLng(latLng(lat, lon))
        .setContent(String(annotation.index))
        .addTo(markersLayer);
    });

  for (const [index, messageEvent] of Object.entries(points)) {
    const lat = messageEvent.message.latitude;
    const lon = messageEvent.message.longitude;

    // if the point is outside the bounds, we don't include it
    if (!localBounds.contains([lat, lon])) {
      continue;
    }

    // get the integer pixel coordinate of the lat/lon and ignore pixels we already have
    const pixelPoint = map.latLngToContainerPoint([lat, lon]);
    const x = Math.trunc(pixelPoint.x);
    const y = Math.trunc(pixelPoint.y);
    if (sparse2d[x]?.[y] === true) {
      continue;
    }

    (sparse2d[x] = sparse2d[x] ?? [])[y] = true;

    const marker = new PointMarker([lat, lon], { ...defaultStyle, radius: POINT_MARKER_RADIUS });
    marker.messageEvent = messageEvent;
    marker.addTo(markersLayer);

    // Add the annotation tooltip if the point is in the annotation time range
    const annotationIndex = pointToAnnotationMap?.[parseInt(index)];
    if (annotationIndex !== undefined) {
      const annotation = annotations?.[annotationIndex];
      annotation &&
        marker.bindTooltip(String(annotation.comment), {
          direction: "top",
        });
    }

    if (args.showAccuracy === true) {
      const accuracy = getAccuracy(messageEvent.message);
      if (accuracy != undefined) {
        const accuracyMarker = new Ellipse([lat, lon], accuracy.radii, accuracy.tilt, {
          color: args.color,
          fillOpacity: 0.2,
          stroke: false,
        });
        accuracyMarker.addTo(markersLayer);
      }
    }
  }

  if (args.onHover) {
    markersLayer.on("mouseover", (event) => {
      const marker = event.sourceTarget as PointMarker;
      marker.setStyle({ color: args.hoverColor });
      marker.bringToFront();
      args.onHover?.(marker.messageEvent);
    });
    markersLayer.on("mouseout", (event) => {
      const marker = event.sourceTarget as PointMarker;
      marker.setStyle(defaultStyle);
      args.onHover?.(undefined);
    });
  }
  if (args.onClick) {
    markersLayer.on("click", (event) => {
      const marker = event.sourceTarget as PointMarker;
      if (marker.messageEvent) {
        args.onClick?.(marker.messageEvent);
      }
    });
  }

  return markersLayer;
}

export default FilteredPointLayer;
