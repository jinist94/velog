import styled from "@emotion/styled";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const CardContainer = styled.div`
  width: 20%;
`;

const Card = ({ children }: CardProps) => {
  return <CardContainer>{children}</CardContainer>;
};

export default Card;
