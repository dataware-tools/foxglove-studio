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
  {
    title: "AnnotationListForTagType_PromptEngineeringEx2",
    type: "AnnotationListForTagType_PromptEngineeringEx2",
    description:
      "CoMLOps のプロンプトエンジニアリング用のパネルです 選択したタグの種類のアノテーションを一覧できます。",
    module: async () =>
      await import("./panels/panelsForCoMLOpsPromptEngineeringEx2/AnnotationListForTagType/panel"),
  },
  {
    title: "AnnotationListForCurrentTimestamp_PromptEngineeringEx2",
    type: "AnnotationListForCurrentTimestamp_PromptEngineeringEx2",
    description:
      "CoMLOps のプロンプトエンジニアリング用のパネルです 現在時刻のアノテーションを一覧できます。",
    module: async () =>
      await import(
        "./panels/panelsForCoMLOpsPromptEngineeringEx2/AnnotationListForCurrentTimeStamp/panel"
      ),
  },
];
