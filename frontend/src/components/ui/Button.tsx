import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export default function Button({ className = "", variant = "primary", ...p }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-200/60",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  }[variant];

  return <button className={`${base} ${styles} ${className}`} {...p} />;
}
