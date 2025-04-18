import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/App.module.css";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx"; // Путь к компоненту кнопки

const TeamDropdownMenu = ({ setShowColumnInput }) => {
  const [isOpen, setIsOpen] = useState(false); // Состояние для открытия/закрытия меню
  const menuRef = useRef(null); // Реф для меню
  const buttonRef = useRef(null); // Реф для кнопки

  // Обработчик для выбора действия
  const handleAction = (action) => {
    if (action === "addColumn") {
      setShowColumnInput();
    } else if (action === "deleteTeam") {
      console.log("Удалить команду");
    }
    setIsOpen(false); // Закрываем меню после выбора действия
  };

  // Обработчик для кликов вне меню
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false); // Закрываем меню, если клик был вне меню и кнопки
    }
  };

  // Добавляем обработчик события на документ при монтировании компонента
  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // Добавляем слушатель событий на весь документ

    // Очищаем слушатель при размонтировании компонента
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer}>
      {/* Кнопка с тремя точками для открытия меню */}
      <DefaultBtn
        ref={buttonRef} // Привязываем ref к кнопке
        className={styles.roundCornersBtn}
        onClick={() => setIsOpen((prev) => !prev)} // Переключаем видимость меню
      >
        &#x22EE; {/* Символ для трёх точек */}
      </DefaultBtn>

      {/* Всплывающее меню */}
      {isOpen && (
        <div ref={menuRef} className={styles.dropdownMenu}>
          <div
            className={styles.dropdownItem}
            onClick={() => handleAction("addColumn")}
          >
            Добавить столбец
          </div>
          <div
            className={styles.dropdownItem}
            onClick={() => handleAction("deleteTeam")}
          >
            Удалить команду
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDropdownMenu;
