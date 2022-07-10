import styled from "@emotion/styled";
import { ReactNode } from "react";
import { SizeType } from "../types";

const StyledText = styled.div``;

interface TextProps {
  children: ReactNode;
  paragraph?: boolean;
  block?: boolean;
  bold?: boolean;
  size?: SizeType | number;
}

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const Text = ({ children, paragraph, size = "sm", block, bold }: TextProps) => {
  const fontStyle = {
    fontSize: typeof size === "number" ? size : fontSizes[size],
    display: block ? "block" : "inline-block",
    fontWeight: bold ? "bold" : "normal",
    lineHeight: "1.5em",
  };

  const Tag = paragraph ? "p" : "span";
  return <Tag style={{ ...fontStyle }}>{children}</Tag>;
};

export default Text;
