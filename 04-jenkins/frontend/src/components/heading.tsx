import type { ComponentPropsWithoutRef, FC } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = {
  as?: HeadingTag;
} & Omit<ComponentPropsWithoutRef<"h1">, "as">;

const sizeByTag: Partial<Record<HeadingTag, string>> = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-lg",
};

const heading: FC<HeadingProps> = ({ as, className, ...props }) => {
  const Tag = as ?? "h1";
  const headingSize = sizeByTag[Tag];
  const classes = ["font-display", "font-bold", headingSize, className].filter(Boolean).join(" ");

  return <Tag className={classes} {...props} />;
};

export default heading;
