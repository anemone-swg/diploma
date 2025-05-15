import { TextField } from "@mui/material";
import { format } from "date-fns";
import { ThemeProvider } from "@mui/material/styles";
import { useMuiTheme } from "@/hooks/useMuiTheme.js";

const ReadOnlyDeadlineDatePicker = ({ value }) => {
  const theme = useMuiTheme();

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
