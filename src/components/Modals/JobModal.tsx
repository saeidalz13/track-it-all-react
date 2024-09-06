import { Button, Modal } from "react-bootstrap";
import JobForm from "../Forms/JobForm";

interface CreateJobModalProps {
  show: boolean;
  onHide: () => void;
}

const JobModal: React.FC<CreateJobModalProps> = (props) => {
  return (
    <Modal show={props.show} centered>
      <Modal.Title className="p-3 text-center">New Job Application</Modal.Title>
      <Modal.Body>
        <JobForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobModal;
