import React from "react";
import InterviewQuestions from "./BehavorialQuestions";

const BehavioralSectionStyle: React.CSSProperties = {
  backgroundColor: "rgba(123, 87, 213, 0.17)",
  color: "black",
  textAlign: "center",
  fontFamily: "Raleway",
  padding: "3vh 6vw",
};

interface BehavioralSectionProps {
  jobUlid: string;
}

const BehavioralSection: React.FC<BehavioralSectionProps> = (props) => {
  return (
    <div style={BehavioralSectionStyle}>
      <h1 className="mt-3 mb-3 text-light">Behavioral Sample Questions</h1>
      <InterviewQuestions jobUlid={props.jobUlid} />
    </div>
  );
};

export default BehavioralSection;
