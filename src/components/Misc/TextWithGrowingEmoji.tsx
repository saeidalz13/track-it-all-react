import React from "react";

interface GrowingArrowProps {
  text: string;
  emoji: string;
}

const TextWithGrowingEmoji: React.FC<GrowingArrowProps> = (props) => {
  return (
    <span className="growing-arrow">
      {props.text}
      <span className="dots">
        <span>{props.emoji}</span>
      </span>
    </span>
  );
};

export default TextWithGrowingEmoji;
