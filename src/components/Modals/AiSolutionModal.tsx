import { Modal } from "react-bootstrap";

interface AiSolutionModalProps {
  show: boolean;
  onHide: () => void;
  solution: string;
}

const AiSolutionModal = ({ solution, show, onHide }: AiSolutionModalProps) => {
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-success">AI Solution</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre
          style={{ padding: "20px", backgroundColor: "black", color: "wheat" }}
        >
          <code>{solution}</code>
        </pre>
      </Modal.Body>
    </Modal>
  );
};

export default AiSolutionModal;
