import React from "react";
import classNames from "classnames";
import styles from "../../styles/App.module.css";

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
        styles.defaultBtn,
        styles[variant],
        {
          [styles.activeDefaultBtn]: active,
          [styles.disable]: disabled,
        },
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={styles.icon} />}
      {children}
    </button>
  );
};

export default DefaultBtn;
