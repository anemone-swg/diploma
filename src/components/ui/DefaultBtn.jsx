import React from "react";
import classNames from "classnames";
import main_styles from "../../styles/App.module.css";
import btn_styles from "./DefaultBtn.module.css";

const DefaultBtn = ({
  variant = "",
  icon: Icon,
  active,
  disabled,
  onClick,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={classNames(
        btn_styles.defaultBtn,
        btn_styles[variant],
        {
          [btn_styles.activeDefaultBtn]: active,
          [btn_styles.disable]: disabled,
        },
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={main_styles.icon} />}
      {children}
    </button>
  );
};

export default DefaultBtn;
