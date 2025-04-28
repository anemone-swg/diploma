import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    primary: {
      main: "#303030",
      contrastText: "#3c3c3c",
    },
    text: {
      primary: "#b3b3b3",
    },
  },
});

const DeadlineDateTimePicker = ({ value, onChange, mode }) => {
  const handleClearDate = () => {
    onChange(null); // очищаем дату
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div style={{ whiteSpace: "nowrap" }}>
          <DesktopDateTimePicker
            disablePast={true}
            value={value}
            onChange={onChange}
            ampm={false} // 24-часовой формат без AM/PM
            inputFormat={"dd.MM.yyyy HH:mm"}
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
          {value && mode === "change" && (
            <IconButton
              onClick={handleClearDate}
              style={{
                position: "relative",
                top: "11px",
                right: "70px",
                color: theme.palette.text.primary,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          {value && mode === "choose" && (
            <IconButton
              onClick={handleClearDate}
              style={{
                position: "relative",
                top: "8px",
                right: "75px",
                color: theme.palette.text.primary,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DeadlineDateTimePicker;
