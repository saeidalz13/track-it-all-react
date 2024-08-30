import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface NavigateButtonProps {
  text: string;
  url: string;
  style?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  disabled?: boolean;
  variant?: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.url);
  };

  return (
    <div style={props.divStyle}>
      <Button
        variant={props.variant ? props.variant : "dark"}
        onClick={handleClick}
        style={props.style}
        disabled={props.disabled}
      >
        {props.text}
      </Button>
    </div>
  );
};

export default NavigateButton;
