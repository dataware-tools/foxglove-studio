import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { UserInputAnnotation } from "./types";

export const AnnotationInputForm = ({
  tagType,
  defaultValues,
  tagOptions,
  onSave,
  saveButtonLabel,
}: {
  tagType: string;
  defaultValues?: Omit<UserInputAnnotation, "tagType">;
  tagOptions: { label: string; value: string }[];
  onSave: (userInputAnnotation: UserInputAnnotation) => Promise<void> | void;
  saveButtonLabel?: string;
}) => {
  const [userInputAnnotation, setUserInputAnnotation] = useState<
    Omit<UserInputAnnotation, "tagType">
  >(
    defaultValues
      ? { ...defaultValues }
      : {
          timestampFrom: 0,
          timestampTo: 0,
          tags: [],
          note: "",
        },
  );

  const userInputAnnotationIsValid =
    userInputAnnotation.timestampFrom &&
    userInputAnnotation.timestampTo &&
    (userInputAnnotation.tags.length > 0 || userInputAnnotation.note);

  return (
    <Stack direction="row" spacing={1} justifyContent="space-between" px={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="開始時刻"
          type="number"
          onChange={(e) =>
            setUserInputAnnotation((prev) => ({ ...prev, timestampFrom: Number(e.target.value) }))
          }
          value={userInputAnnotation.timestampFrom ?? 0}
          defaultValue={userInputAnnotation.timestampFrom ?? 0}
        />
        <TextField
          label="終了時刻"
          type="number"
          onChange={(e) =>
            setUserInputAnnotation((prev) => ({ ...prev, timestampTo: Number(e.target.value) }))
          }
          value={userInputAnnotation.timestampTo ?? 0}
          defaultValue={userInputAnnotation.timestampTo ?? 0}
        />
        <Autocomplete
          multiple
          filterSelectedOptions
          options={tagOptions}
          renderInput={(params) => <TextField {...params} label="タグの値" />}
          onChange={(_, value) => {
            setUserInputAnnotation((prev) => ({ ...prev, tags: value }));
          }}
          value={userInputAnnotation.tags ?? []}
          defaultValue={userInputAnnotation.tags ?? []}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
        <TextField
          label="備考"
          multiline
          onChange={(e) => setUserInputAnnotation((prev) => ({ ...prev, note: e.target.value }))}
          value={userInputAnnotation.note ?? 0}
          defaultValue={userInputAnnotation.note ?? 0}
        />
      </Stack>
      <Box justifyContent={"center"} alignItems={"center"} display="flex">
        <Button
          disabled={!userInputAnnotationIsValid}
          variant="contained"
          onClick={async () => {
            await onSave({ ...userInputAnnotation, tagType });
            setUserInputAnnotation((prev) => ({
              ...prev,
              timestampFrom: 0,
              timestampTo: 0,
              tags: [],
              note: "",
            }));
          }}
        >
          {saveButtonLabel ?? "追加"}
        </Button>
      </Box>
    </Stack>
  );
};
