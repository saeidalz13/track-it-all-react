import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface NavigateButtonProps {
  text: string;
  url: string;
  style?: React.CSSProperties;
}

const NavigateButton: React.FC<NavigateButtonProps> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.url);
  };

  return (
    <div>
      <Button
        className="border border-warning"
        variant="dark"
        onClick={handleClick}
        style={props.style}
      >
        {props.text}
      </Button>
    </div>
  );
};

export default NavigateButton;
