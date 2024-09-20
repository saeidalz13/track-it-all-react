import React from "react";
import { Button } from "react-bootstrap";
import { BtnType } from "../../types/Simples/Simples";

interface CommonButtonProps {
  variant: "dark" | "info" | "success" | "primary" | "link";
  text: React.ReactNode;
  type?: BtnType;
  style?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  disabled?: boolean;
  onClick?: () => void;
}

const CommonButton: React.FC<CommonButtonProps> = (props) => {
  return (
    <div style={props.divStyle}>
      <Button
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
        variant={props.variant}
        style={props.style}
      >
        {props.text}
      </Button>
    </div>
  );
};

export default CommonButton;
