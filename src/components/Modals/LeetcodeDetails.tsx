import { ILeetcode } from "@models/Leetcode/leetcode";
import { Modal } from "react-bootstrap";

interface LeetcodeDetailsProps {
  show: boolean;
  onHide: () => void;
  leetcode: ILeetcode | null;
}

const LeetcodeDetails: React.FC<LeetcodeDetailsProps> = (props) => {
  if (props.leetcode === null) {
    console.log("Here");
    return;
  }

  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.leetcode.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <a href={props.leetcode.link} target="_blank">
            Solve On Leetcode
          </a>
        </div>

        {props.leetcode.attempts.length !== 0
          ? props.leetcode.attempts.map((attempt) => (
              <div>Solved? -`&gt;` {attempt.solved}</div>
            ))
          : "No Attempts Yet"}

        <div className="mt-3">
          <h5>Add Attempts:</h5>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LeetcodeDetails;
