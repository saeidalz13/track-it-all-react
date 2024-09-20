import { SampleQuestions } from "@constants/InterviewConsts";
import { Accordion } from "react-bootstrap";

const s: React.CSSProperties = {
  textAlign: "left",
};

const InterviewQuestions = () => {
  


  return (
    <Accordion style={s}>
      {SampleQuestions.map((questions, idx) => (
        <Accordion.Item eventKey={String(idx)}>
          <Accordion.Header>{questions[0]}</Accordion.Header>
          <Accordion.Body>
            {questions.length > 1 ? (
              <div>
                <h5 className="text-success">Alternative Questions:</h5>
                <ul>
                  {questions.slice(1).map((q) => (
                    <li>{q}</li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            <h5 className="text-primary">Response</h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default InterviewQuestions;
