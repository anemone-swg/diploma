import React from "react";
import DefaultInput from "./DefaultInput.jsx";
import DefaultBtn from "./DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import inputWithActions_styles from "./InputWithActions.module.css";

const InputWithActions = ({
  type, // 'task' или 'column'
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  maxLength = 20,
}) => {
  return (
    <div
      className={
        type === "task"
          ? `${inputWithActions_styles.inputContainer} ${inputWithActions_styles.inputContainerLight}`
          : inputWithActions_styles.inputContainer
      }
    >
      <DefaultInput
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        autoFocus
        maxLength={maxLength}
      />
      <div className={inputWithActions_styles.inputActions}>
        <DefaultBtn
          variant="confirmBtn"
          icon={IoCheckmarkDoneOutline}
          onClick={onSubmit}
        >
          Добавить
        </DefaultBtn>
        <DefaultBtn variant="confirmBtn" icon={RxCross1} onClick={onCancel}>
          Отмена
        </DefaultBtn>
      </div>
    </div>
  );
};

export default InputWithActions;
