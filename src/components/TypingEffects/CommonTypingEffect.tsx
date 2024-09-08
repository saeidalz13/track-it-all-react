import React, { useEffect, useState } from "react";

interface TypingEffectProps {
  words: string[];
  prefix: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number; // Time to pause before deleting or typing a new word
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  prefix,
  words,
  typingSpeed = 50,
  deletingSpeed = 50,
  pauseTime = 1500,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  console.log(prefix);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText !== words[currentWordIndex]) {
      // Typing
      timer = setTimeout(() => {
        setDisplayedText(
          words[currentWordIndex].slice(0, displayedText.length + 1)
        );
      }, typingSpeed);
    } else if (isDeleting && displayedText !== "") {
      // Deleting
      timer = setTimeout(() => {
        setDisplayedText(
          words[currentWordIndex].slice(0, displayedText.length - 1)
        );
      }, deletingSpeed);
    } else if (!isDeleting && displayedText === words[currentWordIndex]) {
      // Pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && displayedText === "") {
      // Move to the next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    words,
    currentWordIndex,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return (
    <span>
      <span style={{ color: "#00FF00" }}>{">"}_</span> trackItAll.
      <span style={{ color: " #00FF00" }}>{displayedText}</span>
    </span>
  );
};

export default TypingEffect;
