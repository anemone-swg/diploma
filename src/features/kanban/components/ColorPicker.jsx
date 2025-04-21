import React, { useEffect, useRef, useState } from "react";
import color_picker_styles from "./ColorPicker.module.css";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import btn_styles from "../../../components/ui/DefaultBtn.module.css";
import { IoIosColorWand } from "react-icons/io";

const ColorPicker = ({
  setSelectedColor,
  setBoards,
  boards,
  column,
  isPastelColor,
}) => {
  const colors = [
    "#232323", // основной цвет (темный, не изменен)
    "#FFDFDF", // светлый пастельный розовый
    "#D4FFDB", // светлый пастельный зеленый
    "#D0E4FF", // светлый пастельный голубой
    "#FFDBFF", // светлый пастельный фиолетовый
    "#FFF1A1", // светлый пастельный желтый
    "#D3FFB3", // светлый пастельный лаймовый
    "#F2F2F2", // светлый пастельный серый
    "#FFD9B3", // светлый пастельный персиковый
    "#B3BFFF", // светлый пастельный синий
  ];
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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Обновляем стиль столбца
    const updatedBoards = boards.map((board) => {
      if (board.id === column.id) {
        board.color = color; // Здесь можно обновить объект колонны с выбранным цветом
      }
      return board;
    });
    setBoards(updatedBoards);
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
          {colors.map((color) => (
            <DefaultBtn
              key={color}
              style={{ backgroundColor: color }}
              className={color_picker_styles.colorSelect}
              onClick={() => {
                handleColorSelect(color);
                setShowColorPicker(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
