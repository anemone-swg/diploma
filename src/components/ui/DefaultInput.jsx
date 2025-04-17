import React from "react";
import styles from "../../styles/App.module.css";

const DefaultInput = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  autoFocus = false,
  className = styles.defaultInput,
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
