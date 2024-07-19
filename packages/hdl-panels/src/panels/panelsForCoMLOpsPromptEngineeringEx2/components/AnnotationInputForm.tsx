import {
  Autocomplete,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useCurrentTime } from "../../../hooks/useCurrentTime";
import { TagOptionsForEachTagType, UserInputAnnotation } from "../types";

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

  const { currentTimeInUnixTime } = useCurrentTime();

  const userInputAnnotationIsValid =
    userInputAnnotation.timestampFrom &&
    userInputAnnotation.timestampTo &&
    (userInputAnnotation.tags.length > 0 || userInputAnnotation.note);

  const [saving, setSaving] = useState(false);

  const tagOptions =
    tagOptionsForEachTagType.find(
      (tagOptions) => tagOptions.tag_type.value === userInputAnnotation.tagType,
    )?.tag_options ?? [];

  const tagTypeOptions = tagOptionsForEachTagType.map((tagOptions) => tagOptions.tag_type);

  const setCurrentTimeAsTimestampFrom = () => {
    currentTimeInUnixTime &&
      setUserInputAnnotation((prev) => ({ ...prev, timestampFrom: currentTimeInUnixTime }));
  };
  const setCurrentTimeAsTimestampTo = () => {
    currentTimeInUnixTime &&
      setUserInputAnnotation((prev) => ({ ...prev, timestampTo: currentTimeInUnixTime }));
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="space-between" px={1} overflow="hidden">
      <Stack direction="column" spacing={1} flexShrink={1} flexGrow={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack flexBasis="50%">
            <TextField
              disabled={saving}
              label="開始時刻"
              type="number"
              onChange={(e) =>
                setUserInputAnnotation((prev) => ({
                  ...prev,
                  timestampFrom: Number(e.target.value),
                }))
              }
              value={userInputAnnotation.timestampFrom ?? 0}
            />
            <Button onClick={setCurrentTimeAsTimestampFrom}>再生中の時刻を開始時刻に入力</Button>
          </Stack>
          <Stack flexBasis="50%">
            <TextField
              disabled={saving}
              label="終了時刻"
              type="number"
              onChange={(e) =>
                setUserInputAnnotation((prev) => ({ ...prev, timestampTo: Number(e.target.value) }))
              }
              value={userInputAnnotation.timestampTo ?? 0}
            />
            <Button onClick={setCurrentTimeAsTimestampTo}>再生中の時刻を終了時刻に入力</Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack flexGrow={0} flexShrink={0}>
            <InputLabel id="tag-type-select-label">タグの種類</InputLabel>
            <Select
              disabled={saving}
              labelId="tag-type-select-label"
              id="tag-type-select"
              value={userInputAnnotation.tagType}
              label="タグの種類"
              onChange={(e) => {
                setUserInputAnnotation((prev) => ({
                  ...prev,
                  tagType: e.target.value,
                  tags: [],
                }));
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
            sx={{ flexGrow: 1, flexShrink: 1 }}
            multiple
            disabled={saving}
            filterSelectedOptions
            options={tagOptions}
            renderInput={(params) => <TextField {...params} label="タグの値" />}
            onChange={(_, value) => {
              setUserInputAnnotation((prev) => ({ ...prev, tags: value }));
            }}
            value={userInputAnnotation.tags ?? []}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
          <TextField
            sx={{ flexGrow: 1, flexShrink: 1 }}
            label="備考"
            disabled={saving}
            onChange={(e) => setUserInputAnnotation((prev) => ({ ...prev, note: e.target.value }))}
            value={userInputAnnotation.note ?? ""}
          />
        </Stack>
      </Stack>
      <Button
        disabled={!userInputAnnotationIsValid || saving}
        variant="contained"
        onClick={async () => {
          setSaving(true);
          await onSave({ ...userInputAnnotation });
          setUserInputAnnotation((prev) => ({
            ...prev,
            timestampFrom: 0,
            timestampTo: 0,
            tags: [],
            note: "",
          }));
          setSaving(false);
        }}
      >
        {saving ? <CircularProgress /> : saveButtonLabel ?? "追加"}
      </Button>
    </Stack>
  );
};
