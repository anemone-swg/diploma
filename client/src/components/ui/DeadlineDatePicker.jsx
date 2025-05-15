import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { ThemeProvider } from "@mui/material";
import { useMuiTheme } from "@/hooks/useMuiTheme.js";

const DeadlineDatePicker = ({ value, onChange }) => {
  const theme = useMuiTheme();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              sx: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                transition: "0.4s background-color ease",
                "&:hover": {
                  backgroundColor: theme.palette.primary.contrastText,
                },
                "&.Mui-focused": {
                  backgroundColor: theme.palette.primary.contrastText,
                },
                "& .MuiSvgIcon-root": {
                  color: theme.palette.text.primary,
                },
              },
            },
            day: {
              sx: {
                color: "var(--text-color)",
                "&.MuiPickersDay-today": {
                  border: "1px solid var(--text-color)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--background-color) !important",
                  color: "var(--text-color) !important",
                  border: "1px solid black",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "var(--background-color) !important",
                },
                "&:hover": {
                  backgroundColor: "var(--background-color)",
                },
              },
            },
            layout: {
              sx: {
                borderRadius: "4px",
                backgroundColor: "var(--light-background-color)",
                color: "var(--text-color)",
                "& .MuiTypography-root": {
                  color: "var(--text-color)",
                },
                "& .MuiIconButton-root": {
                  color: "var(--text-color)",
                },
                border: "1px solid var(--text-color)",
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DeadlineDatePicker;
