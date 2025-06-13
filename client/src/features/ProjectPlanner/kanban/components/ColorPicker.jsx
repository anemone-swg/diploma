import React, { useEffect, useRef, useState } from "react";
import color_picker_styles from "./ColorPicker.module.css";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import { IoIosColorWand } from "react-icons/io";
import { changeColorColumn } from "@/services/ProjectPlannerService.js";
import { useTheme } from "@/context/ThemeContext.jsx";
import { columnColors } from "@/constants/columnColors.js";

const ColorPicker = ({ setBoards, column, isPastelColor }) => {
  const { theme } = useTheme();

  const divRef = useRef(null);
  const buttonRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false); // Состояние для показа/скрытия выбора цвета

  const handleClickOutside = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleColorSelect = async (color, columnId) => {
    await changeColorColumn(color, columnId);

    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        teams: board.teams.map((team) => ({
          ...team,
          columns: team.columns.map((col) =>
            col.id === column.id ? { ...col, color } : col,
          ),
        })),
      })),
    );

    setShowColorPicker(false);
  };

  return (
    <div className={color_picker_styles.colorPickerContainer}>
      {/* Кнопка для открытия выбора цвета */}
      <DefaultBtn
        ref={buttonRef}
        onClick={() => setShowColorPicker(!showColorPicker)}
        className={`${btn_styles.roundCornersBtn} ${isPastelColor ? btn_styles.pastel : ""}`}
        icon={IoIosColorWand}
      ></DefaultBtn>

      {showColorPicker && (
        <div ref={divRef} className={color_picker_styles.colorPicker}>
          {Object.entries(columnColors[theme]).map(([key, color]) => (
            <DefaultBtn
              key={key}
              style={{ backgroundColor: color }}
              className={color_picker_styles.colorSelect}
              onClick={() => handleColorSelect(key, column.id)} // передаем key, а не цвет
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
