import React from "react";
import InterviewQuestions from "./InterviewQuestions";

const InterviewSectionStyle: React.CSSProperties = {
  backgroundColor: "#efe1d150",
  color: "black",
  textAlign: "center",
  //   fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "3vh 6vw",
};

interface InterviewSectionProps {
  jobUlid: string;
}

const InterviewSection: React.FC<InterviewSectionProps> = (props) => {
  return (
    <div style={InterviewSectionStyle}>
      <h1 className="mb-3">Interview Sample Questions</h1>
      <InterviewQuestions jobUlid={props.jobUlid} />
    </div>
  );
};

export default InterviewSection;
