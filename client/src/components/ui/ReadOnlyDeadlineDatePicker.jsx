import { createTheme, TextField } from "@mui/material";
import { format } from "date-fns";
import { ThemeProvider } from "@mui/material/styles";

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

const ReadOnlyDeadlineDatePicker = ({ value }) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        value={value ? format(new Date(value), "dd.MM.yyyy") : "Без срока"}
        disabled
        fullWidth
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          "& .MuiInputBase-input.Mui-disabled": {
            color: theme.palette.text.primary,
            WebkitTextFillColor: theme.palette.text.primary, // нужно для цвета текста при disabled
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
          },
        }}
      />
    </ThemeProvider>
  );
};

export default ReadOnlyDeadlineDatePicker;
