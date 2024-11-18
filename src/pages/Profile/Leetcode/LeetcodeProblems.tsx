import { useEffect, useState } from "react";

const noProblemDivStyle: React.CSSProperties = {
  fontSize: "25px",
  fontWeight: "600",
  color: "maroon",
};

const LeetcodeProblems = () => {
  const [problems, setProblems] = useState<Array<string>>([]);

  useEffect(() => {
    setProblems([]);
  }, []);

  return (
    <div>
      {problems.length === 0 ? (
        <div style={noProblemDivStyle}>No Problems Yet!</div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LeetcodeProblems;
