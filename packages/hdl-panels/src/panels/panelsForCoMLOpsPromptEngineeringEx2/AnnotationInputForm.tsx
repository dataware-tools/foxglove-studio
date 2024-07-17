import {
  Autocomplete,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { TagOptionsForEachTagType, UserInputAnnotation } from "./types";

export const AnnotationInputForm = ({
  defaultValues,
  tagOptionsForEachTagType,
  onSave,
  saveButtonLabel,
}: {
  defaultValues?: UserInputAnnotation;
  tagOptionsForEachTagType: TagOptionsForEachTagType;
  onSave: (userInputAnnotation: UserInputAnnotation) => Promise<void> | void;
  saveButtonLabel?: string;
}) => {
  const [userInputAnnotation, setUserInputAnnotation] = useState<UserInputAnnotation>(
    defaultValues
      ? { ...defaultValues }
      : {
          timestampFrom: 0,
          timestampTo: 0,
          tags: [],
          note: "",
          tagType: tagOptionsForEachTagType[0]?.tag_type.value ?? "",
        },
  );

  const userInputAnnotationIsValid =
    userInputAnnotation.timestampFrom &&
    userInputAnnotation.timestampTo &&
    (userInputAnnotation.tags.length > 0 || userInputAnnotation.note);

  const tagOptions =
    tagOptionsForEachTagType.find(
      (tagOptions) => tagOptions.tag_type.value === userInputAnnotation.tagType,
    )?.tag_options ?? [];

  const tagTypeOptions = tagOptionsForEachTagType.map((tagOptions) => tagOptions.tag_type);

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
        <Stack>
          <InputLabel id="tag-type-select-label">タグの種類</InputLabel>
          <Select
            labelId="tag-type-select-label"
            id="tag-type-select"
            value={userInputAnnotation.tagType}
            label="タグの種類"
            onChange={(e) => {
              setUserInputAnnotation((prev) => ({ ...prev, tagType: e.target.value, tags: [] }));
            }}
          >
            {tagTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
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
            await onSave({ ...userInputAnnotation });
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
