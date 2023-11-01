import { usePlayerState } from "../stores/player";
import { useCameraTopicState } from "../stores/topic";
import { buildSampleImage } from "./ImageAnnotationCanvas.stories";
import { ImageAnnotatorPanelPresentation } from "./panel";

export default {
  title: "HDLPanels/ImageAnnotator",
  component: ImageAnnotatorPanelPresentation,
};

export function Default(): JSX.Element {
  const width = 400;
  const height = 300;
  const data = buildSampleImage(width, height);

  const setCameraTopic = useCameraTopicState((state) => state.setCameraTopic);
  setCameraTopic("test", "test");
  const setCurrentTime = usePlayerState((state) => state.setCurrentTime);
  setCurrentTime({ sec: 1, nsec: 0 });

  return (
    <ImageAnnotatorPanelPresentation
      image={{
        type: "raw",
        stamp: { sec: 0, nsec: 0 },
        data,
        width,
        height,
        encoding: "rgb8",
        is_bigendian: false,
        step: 1,
      }}
    />
  );
}
