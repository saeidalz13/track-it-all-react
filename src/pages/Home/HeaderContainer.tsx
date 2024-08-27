import React from "react";
import { Container } from "react-bootstrap";
import TypingEffect from "../../components/TypingEffects/CommonTypingEffect";

const typingContainerStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0", 
  textAlign: "center", 
  fontSize: "6vh",
  fontFamily: "monospace",
  padding: "10vh 5vw ",
};

const HeaderContainer = () => {
  const words = ["Applications!", "Courses!", "Leetcode!"];

  return (
    <Container style={typingContainerStyle} fluid>
      <TypingEffect prefix="Track Your" words={words} />
    </Container>
  );
};

export default HeaderContainer;
