import React, { useEffect, useRef, useState } from "react";
import main_styles from "../../../styles/App.module.css";
import dropdownMenu_styles from "./dropdownMenu.module.css";
import btn_styles from "../../../components/ui/DefaultBtn.module.css";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import { FaPlus, FaTrash } from "react-icons/fa";

const DropdownMenu = ({
  type, // 'team' или 'column'
  onAdd, // Функция добавления (столбца или задачи)
  onDelete, // Функция удаления (команды или столбца)
  onPrepareDelete, // Подготовка данных перед удалением
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const menuItems = {
    team: [
      {
        action: "addColumn",
        icon: <FaPlus className={main_styles.smallIcon} />,
        text: "Добавить столбец",
        handler: onAdd,
      },
      {
        action: "deleteTeam",
        icon: <FaTrash className={main_styles.smallIcon} />,
        text: "Удалить команду",
        handler: () => {
          onPrepareDelete();
          onDelete(true);
        },
      },
    ],
    column: [
      {
        action: "addTask",
        icon: <FaPlus className={main_styles.smallIcon} />,
        text: "Добавить задачу",
        handler: onAdd,
      },
      {
        action: "deleteColumn",
        icon: <FaTrash className={main_styles.smallIcon} />,
        text: "Удалить столбец",
        handler: () => {
          onPrepareDelete();
          onDelete(true);
        },
      },
    ],
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={dropdownMenu_styles.dropdownContainer}>
      <DefaultBtn
        ref={buttonRef}
        className={btn_styles.roundCornersBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Меню ${type === "team" ? "команды" : "столбца"}`}
      >
        &#x22EE;
      </DefaultBtn>

      {isOpen && (
        <div ref={menuRef} className={dropdownMenu_styles.dropdownMenu}>
          {menuItems[type].map((item) => (
            <div
              key={item.action}
              className={dropdownMenu_styles.dropdownItem}
              onClick={() => {
                item.handler();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
