import { Box, Stack } from "@mui/material";
import { Meta } from "@storybook/react";
import React from "react";
import { FoxGloveThemeProvider } from "../../../../utils/ThemeProvider";
import { Annotation, Point } from "../../types";
import { AdaptiveCommentPin } from "./AdaptiveCommentPin";
import { CommentPinPresentation } from "./CommentPinPresentation";

const meta: Meta<typeof CommentPinPresentation> = {
  title: "components/CommentPin",
  component: CommentPinPresentation,
};
export default meta;

const longSentence =
  "The quick brown fox jumps over the lazy dog, but the lazy dog doesn't really care because it's too busy sleeping and dreaming of chasing rabbits through fields of clover and daffodils.";

const annotation: Annotation = {
  index: 0,
  id: "XXXX-XXXX",
  type: "rect",
  centerPoint: new Point(0, 0),
  comment: longSentence,
  targetTopic: "topic_1",
  timestamp_from: 0,
  timestamp_to: 0,
  generation: 0,
  frame_id: "frame_id_1",
};
export function Variation(): JSX.Element {
  return (
    <FoxGloveThemeProvider>
      <Box p={2} position="relative">
        <Stack>
          {[
            { index: 1 },
            { index: 99 },
            { index: 1, loading: true },
            { index: 1, isOnTime: false },
          ].map((args, key) => (
            <Box position="relative" height={100} key={key}>
              <CommentPinPresentation comment={longSentence} {...args} />
              <CommentPinPresentation comment={longSentence} open left={80} {...args} />
            </Box>
          ))}
        </Stack>
      </Box>
    </FoxGloveThemeProvider>
  );
}

export function Placement(): JSX.Element {
  return (
    <FoxGloveThemeProvider>
      <Stack p={2} spacing={2}>
        {["left-top", "left-bottom", "right-top", "right-bottom"].map((placement, pkey) => (
          <Box
            key={pkey}
            position="relative"
            width="100%"
            height="200px"
            bgcolor={(theme) => theme.palette.grey[100]}
          >
            <Box
              width="100px"
              height="100px"
              borderRight="1px dashed red"
              borderBottom="1px dashed red"
            >
              {placement}
            </Box>
            <CommentPinPresentation
              index={1}
              comment={longSentence}
              // @ts-expect-error for debug
              placement={placement}
              open
              top={100}
              left={100}
            />
          </Box>
        ))}
      </Stack>
    </FoxGloveThemeProvider>
  );
}

const InteractiveCommentPin = (props: { placement: string; offset: number }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box
      position="relative"
      width="100%"
      height="200px"
      bgcolor={(theme) => theme.palette.grey[100]}
    >
      <Box width="200px" height="100px" borderRight="1px dashed red" borderBottom="1px dashed red">
        {" "}
      </Box>
      <CommentPinPresentation
        index={1}
        comment={longSentence}
        // @ts-expect-error for debug
        placement={props.placement}
        offset={props.offset}
        open={open}
        left={200}
        top={100}
        onMouseOver={() => {
          setOpen(true);
        }}
        onMouseOut={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
};

export function Interactive(): JSX.Element {
  return (
    <FoxGloveThemeProvider>
      <Stack p={2} spacing={2}>
        {["left-top", "left-bottom", "right-top", "right-bottom"].map((placement, pkey) => (
          <InteractiveCommentPin placement={placement} key={pkey} offset={5} />
        ))}
      </Stack>
    </FoxGloveThemeProvider>
  );
}

export function Adaptive(): JSX.Element {
  return (
    <FoxGloveThemeProvider>
      <Stack p={2} spacing={2}>
        {[
          [20, 10],
          [20, 180],
          [400, 10],
          [400, 180],
        ].map(([left, top], pkey) => (
          <Box
            key={pkey}
            bgcolor={(theme) => theme.palette.grey[100]}
            width={500}
            height={200}
            position="relative"
          >
            <Box
              width={left}
              height={top}
              borderRight="1px dashed red"
              borderBottom="1px dashed red"
            >
              {" "}
            </Box>
            <AdaptiveCommentPin
              spaceWidth={500}
              spaceHeight={200}
              offset={10}
              {...annotation}
              index={1}
              comment={longSentence}
              open
              left={left}
              top={top}
            />
          </Box>
        ))}
      </Stack>
    </FoxGloveThemeProvider>
  );
}
