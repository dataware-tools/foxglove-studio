import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { PopoverIconButton } from "./PopoverIconButton";

export type SearchBarProps = {
  onSearch?: (text: string) => void;
  onChangeText?: (text: string) => void | Promise<void>;
};
export const SearchBar = ({ onSearch, onChangeText }: SearchBarProps) => {
  const [text, setText] = useState("");
  const theme = useTheme();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setText(text);
    await onChangeText?.(text);
  };
  return (
    <Stack direction="row" spacing={1} width="100%" alignItems="center">
      <TextField
        value={text}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        placeholder="Search..."
        size="small"
        inputProps={{
          style: {
            color: theme.palette.text.primary,
          },
        }}
        InputProps={{
          sx: {
            border: `1px solid ${theme.palette.text.primary}`,
            "&:before": {
              border: `1px solid ${theme.palette.text.primary}`,
            },
          },
        }}
      />
      <PopoverIconButton
        iconButtonProps={{
          children: <SearchIcon />,
          onClick: () => onSearch && onSearch(text),
        }}
        popoverProps={{ children: "search" }}
      />
    </Stack>
  );
};
