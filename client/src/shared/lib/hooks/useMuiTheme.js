import { useEffect, useMemo, useState } from "react";
import { createTheme } from "@mui/material";

export const useMuiTheme = () => {
  const getColorsFromCSS = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      primaryMain: styles.getPropertyValue("--background-color").trim(),
      primaryContrast: styles
        .getPropertyValue("--light-background-color")
        .trim(),
      textPrimary: styles.getPropertyValue("--text-color").trim(),
    };
  };

  const [colors, setColors] = useState(getColorsFromCSS());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setColors(getColorsFromCSS());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return useMemo(() => {
    return createTheme({
      palette: {
        primary: {
          main: colors.primaryMain,
          contrastText: colors.primaryContrast,
        },
        text: {
          primary: colors.textPrimary,
        },
      },
    });
  }, [colors]);
};
