// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { PanelInfo } from "@foxglove/studio-base/context/PanelCatalogContext";
import hdlMapThumbnail from "./panels/HDLMap/thumbnail.png";

export const getHDLDeveloped: () => PanelInfo[] = () => [
  {
    title: "HDLSample",
    type: "HDLSample",
    description: "HDLによるサンプルパネルです。",
    module: async () => await import("./panels/Sample"),
  },
  {
    title: "ImageAnnotator",
    type: "ImageAnnotator",
    description: "HDLによる画像アノテーション用のパネルです。",
    module: async () => await import("./panels/AnnotationManagement/ImageAnnotator/panel"),
  },
  {
    title: "AnnotationList",
    type: "AnnotationList",
    description: "HDLによるアノテーション一覧用のパネルです。",
    module: async () => await import("./panels/AnnotationManagement/AnnotationList/panel"),
  },
  {
    title: "HDLMap",
    type: "HDLMap",
    description: "HDLにより改良した地図パネルです。",
    thumbnail: hdlMapThumbnail,
    module: async () => await import("./panels/HDLMap"),
  },
];
