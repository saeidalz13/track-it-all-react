import React from "react";
import { Button } from "react-bootstrap";
import { BtnType } from "../../types/Simples/Simples";

interface CommonButtonProps {
  variant: string;
  text: string;
  type?: BtnType;
  style?: React.CSSProperties;
}

const CommonButton: React.FC<CommonButtonProps> = (props) => {
  return (
    <div>
      <Button type={props.type} variant={props.variant} style={props.style}>
        {props.text}
      </Button>
    </div>
  );
};

export default CommonButton;
