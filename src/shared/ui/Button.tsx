import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; children: ReactNode };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; children: ReactNode };

export function Button(props: ButtonProps | AnchorProps) {
  if (props.as === "a") {
    const { as: _as, className = "", ...anchorProps } = props;
    return <a className={`common-button ${className}`} {...anchorProps} />;
  }
  const { as: _as, className = "", type = "button", ...buttonProps } = props;
  return <button className={`common-button ${className}`} type={type} {...buttonProps} />;
}
