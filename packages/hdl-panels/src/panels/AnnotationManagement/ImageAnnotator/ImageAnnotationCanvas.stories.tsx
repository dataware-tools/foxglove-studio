import { usePlayerState } from "../stores/player";
import { useCameraTopicState } from "../stores/topic";
import { ImageAnnotationCanvas } from "./ImageAnnotationCanvas";

export default {
  title: "HDLComponents/ImageAnnotationCanvas",
  component: ImageAnnotationCanvas,
  excludeStories: ["buildSampleImage"],
};

export const buildSampleImage = (width: number, height: number) => {
  const data = new Uint8Array(3 * height * width);
  let idx = 0;
  const maxValue = 120;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const r = Math.max(0, 1 - Math.hypot(1 - row / height, col / width)) * maxValue;
      const g = Math.max(0, 1 - Math.hypot(row / height, 1 - col / width)) * maxValue;
      const b = Math.max(0, 1 - Math.hypot(1 - row / height, 1 - col / width)) * maxValue;
      data[idx++] = r;
      data[idx++] = g;
      data[idx++] = b;
    }
  }
  return data;
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
    <ImageAnnotationCanvas
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

export function EmptyCameraTopic(): JSX.Element {
  const width = 400;
  const height = 300;
  const data = buildSampleImage(width, height);

  const setCameraTopic = useCameraTopicState((state) => state.setCameraTopic);
  setCameraTopic("test", "");

  return (
    <ImageAnnotationCanvas
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
