import InterviewQuestions from "./InterviewQuestions";

const InterviewSectionStyle: React.CSSProperties = {
  backgroundColor: "#efe1d194",
  color: "black",
  textAlign: "center",
//   fontSize: "clamp(35px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "3vh 6vw",
};

const InterviewSection = () => {
  return (
    <div style={InterviewSectionStyle}>
      <h1 className="mb-3">Interview Sample Questions</h1>
      <InterviewQuestions />
    </div>
  );
};

export default InterviewSection;
