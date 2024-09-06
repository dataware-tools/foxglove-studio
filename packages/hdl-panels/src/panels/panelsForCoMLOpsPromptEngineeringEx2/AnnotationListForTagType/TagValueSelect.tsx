import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { TagOptions } from "../types";

export const TagValueSelect = ({
  tagValue,
  tagOptions,
  ...muiSelectProps
}: {
  tagValue: string;
  tagOptions: TagOptions;
} & SelectProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="tag-value-select-label">タグの値</InputLabel>
      <Select
        labelId="tag-value-select-label"
        id="tag-value-select"
        value={tagValue}
        label="タグの値"
        {...muiSelectProps}
      >
        {tagOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
