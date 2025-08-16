import React, { useEffect, useRef, useState } from "react";
import color_picker_styles from "@/features/ColorPicker/ui/ColorPicker.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { IoIosColorWand } from "react-icons/io";
import { useTheme } from "@/shared/lib/hooks/useTheme.js";
import { columnColors } from "@/shared/constants/columnColors.js";
import { changeColorColumn } from "../model/api/changeColorColumn.js";

const ColorPicker = ({ setBoards, column, isPastelColor }) => {
  const { theme } = useTheme();

  const divRef = useRef(null);
  const buttonRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleColorSelect = (color, columnId) => {
    changeColorColumn(color, columnId).then(() => {
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
    });
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
              onClick={() => handleColorSelect(key, column.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
