import React from "react";
import classNames from "classnames";
import styles from "@/shared/lib/classNames/Additional.module.css";
import btn_styles from "./DefaultBtn.module.css";

const DefaultBtn = React.forwardRef(
  (
    {
      variant = "",
      icon: Icon,
      active,
      disabled,
      onClick,
      children,
      className,
      visibleDisabled,
      svgMargin,
      ...props
    },
    ref, // второй аргумент для рефа
  ) => {
    return (
      <button
        ref={ref} // передаем ref в кнопку
        className={classNames(
          btn_styles.defaultBtn,
          btn_styles[variant],
          {
            [btn_styles.noSvgMargin]: !svgMargin,
            [btn_styles.SvgMargin]: svgMargin,
            [btn_styles.activeDefaultBtn]: active,
            [btn_styles.disable]: disabled,
            [btn_styles.visibleDisable]: visibleDisabled,
          },
          className,
        )}
        onClick={onClick}
        disabled={disabled || visibleDisabled}
        {...props}
      >
        {Icon && <Icon className={styles.icon} />}
        {children}
      </button>
    );
  },
);

export default DefaultBtn;
