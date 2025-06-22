import { useContext } from "react";
import { ThemeContext } from "@/shared/context/themeContext.js";

export const useTheme = () => useContext(ThemeContext);
