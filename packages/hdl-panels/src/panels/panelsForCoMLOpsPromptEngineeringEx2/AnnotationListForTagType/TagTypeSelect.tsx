import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";

export const TagTypeSelect = ({
  tagType,
  tagTypeOptions,
  ...muiSelectProps
}: {
  tagType: string;
  tagTypeOptions: { label: string; value: string }[];
} & SelectProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="tag-type-select-label">タグの種類</InputLabel>
      <Select
        labelId="tag-type-select-label"
        id="tag-type-select"
        value={tagType}
        label="タグの種類"
        {...muiSelectProps}
      >
        {tagTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
