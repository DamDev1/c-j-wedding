import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  tone?: "olive" | "white";
};

const tones = {
  olive: "bg-olive text-white",
  white: "bg-white text-leaf",
} as const;

/** Pill link-button used across the site (RSVP, Get Directions, ...). */
export function Button({
  tone = "olive",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      {...props}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-[30px] px-8 py-3 text-base leading-6 font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${tones[tone]} ${className}`}
    >
      {children}
    </a>
  );
}
