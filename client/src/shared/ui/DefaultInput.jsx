import React from "react";
import input_styles from "./DefaultInput.module.css";

const DefaultInput = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  autoFocus = false,
  className = input_styles.defaultInput,
  maxLength = 20,
  ...props
}) => {
  return (
    <input
      className={className}
      type="text"
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      {...props}
    />
  );
};

export default DefaultInput;
