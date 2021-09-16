import css from "./Button.module.css";
import React, { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (props: Props) => {
  return <button className={css.button} {...props} />;
};

export default Button;
