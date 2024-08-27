import React from "react";
import { Container } from "react-bootstrap";
import TypingEffect from "../../components/TypingEffects/CommonTypingEffect";

const typingContainerStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0", 
  textAlign: "center", 
  fontSize: "clamp(35px, 6vw, 70px)",
  fontFamily: "monospace",
  padding: "15vh 5vw ",
};

const HeaderContainer = () => {
  const words = ["Jobs!", "Courses!", "Leetcode!"];

  return (
    <Container style={typingContainerStyle} fluid>
      <TypingEffect prefix="Track All Your" words={words} />
    </Container>
  );
};

export default HeaderContainer;
