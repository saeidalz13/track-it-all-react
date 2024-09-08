import { Modal } from "react-bootstrap";
import JobForm from "../Forms/JobForm";

interface CreateJobModalProps {
  show: boolean;
  onHide: () => void;
}

const JobModal: React.FC<CreateJobModalProps> = (props) => {
  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-success">
          New Job Application
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <JobForm onHide={props.onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default JobModal;
