import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

export default function Link({
  href,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(new Event("ocean-log:navigation"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <a {...props} href={href} onClick={handleClick}>{children}</a>;
}
