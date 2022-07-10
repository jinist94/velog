import styled from "@emotion/styled";
import { ReactNode } from "react";

import { jsx, css } from "@emotion/react";
import { SerializedStyles } from "@emotion/serialize";

type buttonType = "primary" | "black" | "default";

interface Props {
  children: ReactNode;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  styleType?: buttonType;
  color?: string;
  round?: "circle" | number;
  style?: any;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  block?: boolean;
}

interface ButtonProps {
  styleType?: string;
}

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const theme: { [key: string]: SerializedStyles } = {
  default: css`
    border: 1px solid #ddd;
  `,
  primary: css`
    background-color: #1890ff;
    color: white;
  `,
  black: css`
    background-color: black;
    color: white;
  `,
};

const StyledButton = styled.button<ButtonProps>`
  padding: 6px 12px;
  background-color: transparent;
  outline: 0;
  border: 0;
  cursor: pointer;

  ${({ styleType }) => styleType && theme[styleType]}
`;

const Button = ({
  children,
  onClick,
  type,
  styleType = "default",
  round,
  size = "sm",
  loading,
  block,
  style,
}: Props) => {
  const buttonStyle = {
    borderRadius: round === "circle" ? "50%" : typeof round === "number" ? round : 0,
    display: block && "block",
    fontSizes: fontSizes[size],
  };

  return (
    <StyledButton
      style={{ ...buttonStyle, ...style }}
      type={type}
      styleType={styleType}
      onClick={onClick}
      disabled={loading}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
