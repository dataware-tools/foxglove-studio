import { createTheme, ThemeProvider as MuiThemeProvider, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const FoxGloveThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const overridedTheme = createTheme({
    ...theme,
  });

  return <MuiThemeProvider theme={overridedTheme}>{children}</MuiThemeProvider>;
};
