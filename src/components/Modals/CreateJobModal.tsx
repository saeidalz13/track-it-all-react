import { Button, Modal } from "react-bootstrap";
import CreateJobForm from "../Forms/CreateJobForm";

interface CreateJobModalProps {
    show: boolean
    onHide: () => void
}


const CreateJobModal: React.FC<CreateJobModalProps> = (props) => {
  return (
    <Modal show={props.show} centered>
      <Modal.Title className="p-3 text-center">New Job Application</Modal.Title>
      <Modal.Body>
        <CreateJobForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateJobModal;
