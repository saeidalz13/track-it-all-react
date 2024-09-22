import React from "react";
import InterviewQuestions from "./InterviewQuestions";

const InterviewSectionStyle: React.CSSProperties = {
  backgroundColor: "rgba(123, 87, 213, 0.17)",
  color: "black",
  textAlign: "center",
  fontFamily: "Raleway",
  padding: "3vh 6vw",
};

interface InterviewSectionProps {
  jobUlid: string;
}

const InterviewSection: React.FC<InterviewSectionProps> = (props) => {
  return (
    <div style={InterviewSectionStyle}>
      <h1 className="mb-3 text-light">Interview Sample Questions</h1>
      <InterviewQuestions jobUlid={props.jobUlid} />
    </div>
  );
};

export default InterviewSection;
