import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { Meta } from "@storybook/react";
import React from "react";
import { FoxGloveThemeProvider } from "../../utils/ThemeProvider";
import { Annotation, Point } from "../types";
import {
  CommentCardPresentation,
  CommentCardPresentationProps,
} from "./CommentCard";

const meta: Meta<typeof CommentCardPresentation> = {
  title: "components/CommentCard",
  component: CommentCardPresentation,
};
export default meta;

const annotation: Annotation = {
  index: 0,
  id: "XXXX-XXXX",
  type: "rect",
  centerPoint: new Point(0, 0),
  comment: "test comment",
  targetTopic: "topic_1",
  timestamp_from: 0,
  timestamp_to: 0,
  generation: 0,
  frame_id: "frame_id_1",
};

const longSentence =
  "The quick brown fox jumps over the lazy dog, but the lazy dog doesn't really care because it's too busy sleeping and dreaming of chasing rabbits through fields of clover and daffodils.";

const defaultArgs: CommentCardPresentationProps = {
  annotation,
  top: -5,
  left: 10,
  isLoading: false,
  editingHasUpdate: false,
  isOnTimestamp: true,
  menuItems: [
    {
      label: "Duplicate",
      icon: <ContentCopyIcon fontSize="small" />,
      disabled: true,
      callback: () => {
        console.log("duplicate");
      },
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      disabled: false,
      callback: () => {
        console.log("delete");
      },
    },
  ],
  handleSubmitComment: async (_e, value) => {
    console.log(value);
  },
  onCommentChange: (e) => {
    console.log(e.target.value);
  },
  onInstanceChange: (e) => {
    console.log(e.target.value);
  },
  onClose: () => {
    console.log("close");
  },
  onSeekBack: () => {
    console.log("seek back");
  },
};

function Variation({ title }: { title: string }): JSX.Element {
  return (
    <FoxGloveThemeProvider>
      <Stack spacing={2} p={2}>
        <Typography variant="h3">{title}</Typography>

        <Typography>default</Typography>
        <CommentCardPresentation {...defaultArgs} />

        <Typography>loading</Typography>
        <CommentCardPresentation {...defaultArgs} isLoading />

        <Typography>long sentence</Typography>
        <CommentCardPresentation
          {...defaultArgs}
          annotation={{ ...annotation, comment: longSentence.repeat(4) }}
        />

        <Typography>timestamp is not on time</Typography>
        <CommentCardPresentation
          {...defaultArgs}
          annotation={{ ...annotation, comment: longSentence.repeat(4) }}
          isOnTimestamp={false}
        />
      </Stack>
    </FoxGloveThemeProvider>
  );
}

export function EditableVariation(): JSX.Element {
  return <Variation title="editable" />;
}

export function Interactive(): JSX.Element {
  const [isOnTimestamp, setIsOnTimestamp] = React.useState(true);
  return (
    <FoxGloveThemeProvider>
      <CommentCardPresentation
        {...defaultArgs}
        top={10}
        isOnTimestamp={isOnTimestamp}
        onClose={() => {
          console.log("close");
        }}
      />
      <FormControlLabel
        sx={{ m: 2 }}
        control={
          <Checkbox
            value={isOnTimestamp}
            onChange={() => setIsOnTimestamp((val) => !val)}
          />
        }
        label="isOnTimestamp"
      />
    </FoxGloveThemeProvider>
  );
}
