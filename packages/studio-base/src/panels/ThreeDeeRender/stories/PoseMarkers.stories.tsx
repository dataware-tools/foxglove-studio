// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { MessageEvent, Topic } from "@foxglove/studio";
import useDelayedFixture from "@foxglove/studio-base/panels/ThreeDimensionalViz/stories/useDelayedFixture";
import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";

import ThreeDeeRender from "../index";
import { PoseStamped, PoseWithCovarianceStamped, TF } from "../ros";
import { BASE_LINK_FRAME_ID, FIXED_FRAME_ID, QUAT_IDENTITY, SENSOR_FRAME_ID } from "./common";

export default {
  title: "panels/ThreeDeeRender",
  component: ThreeDeeRender,
};

PoseMarkers.parameters = { colorScheme: "dark" };
export function PoseMarkers(): JSX.Element {
  const topics: Topic[] = [
    { name: "/tf", datatype: "geometry_msgs/TransformStamped" },
    { name: "/pose", datatype: "geometry_msgs/PoseStamped" },
    { name: "/pose_with_covariance", datatype: "geometry_msgs/PoseWithCovarianceStamped" },
    { name: "/pose_with_hidden_covariance", datatype: "geometry_msgs/PoseWithCovarianceStamped" },
  ];

  const tf1: MessageEvent<TF> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: FIXED_FRAME_ID },
      child_frame_id: BASE_LINK_FRAME_ID,
      transform: {
        translation: { x: 1e7, y: 0, z: 0 },
        rotation: QUAT_IDENTITY,
      },
    },
    sizeInBytes: 0,
  };
  const tf2: MessageEvent<TF> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: BASE_LINK_FRAME_ID },
      child_frame_id: SENSOR_FRAME_ID,
      transform: {
        translation: { x: 0, y: 0, z: 1 },
        rotation: { x: 0.383, y: 0, z: 0, w: 0.924 },
      },
    },
    sizeInBytes: 0,
  };

  const pose1: MessageEvent<Partial<PoseStamped>> = {
    topic: "/pose",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: SENSOR_FRAME_ID },
      pose: {
        position: { x: 0, y: 0, z: -1 },
        orientation: { x: 0, y: -Math.SQRT1_2, z: 0, w: Math.SQRT1_2 },
      },
    },
    sizeInBytes: 0,
  };

  const pose2: MessageEvent<Partial<PoseWithCovarianceStamped>> = {
    topic: "/pose_with_covariance",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: BASE_LINK_FRAME_ID },
      pose: {
        pose: {
          position: { x: 0, y: 0, z: 0 },
          orientation: QUAT_IDENTITY,
        },
        // prettier-ignore
        covariance: [
          2 * 2, 0, 0, 0, 0, 0,
          0, 0.15 * 0.15, 0, 0, 0, 0,
          0, 0, 0.3 * 0.3, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
        ],
      },
    },
    sizeInBytes: 0,
  };

  const pose3: MessageEvent<Partial<PoseWithCovarianceStamped>> = {
    topic: "/pose_with_hidden_covariance",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: SENSOR_FRAME_ID },
      pose: {
        pose: {
          position: { x: -1, y: 0, z: -1 },
          orientation: { x: 0, y: -Math.SQRT1_2, z: 0, w: Math.SQRT1_2 },
        },
        // prettier-ignore
        covariance: [
          1, 0, 0, 0, 0, 0,
          0, 1, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0,
        ],
      },
    },
    sizeInBytes: 0,
  };

  const fixture = useDelayedFixture({
    topics,
    frame: {
      "/tf": [tf1, tf2],
      "/pose": [pose1],
      "/pose_with_covariance": [pose2],
      "/pose_with_hidden_covariance": [pose3],
    },
    capabilities: [],
    activeData: {
      currentTime: { sec: 0, nsec: 0 },
    },
  });

  return (
    <PanelSetup fixture={fixture}>
      <ThreeDeeRender
        overrideConfig={{
          ...ThreeDeeRender.defaultConfig,
          followTf: "base_link",
          scene: { enableStats: false },
          cameraState: {
            distance: 4,
            perspective: true,
            phi: 1,
            targetOffset: [-0.6, 0.5, 0],
            thetaOffset: -1,
            fovy: 0.75,
            near: 0.01,
            far: 5000,
            target: [0, 0, 0],
            targetOrientation: [0, 0, 0, 1],
          },
          topics: {
            "/pose": {
              color: "rgba(107, 220, 255, 0.5)",
            },
            "/pose_with_hidden_covariance": {
              showCovariance: false,
              covarianceColor: "rgba(255, 0, 0, 1)",
            },
          },
        }}
      />
    </PanelSetup>
  );
}
