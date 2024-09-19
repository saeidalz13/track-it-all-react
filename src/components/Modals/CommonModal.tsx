import { Modal } from "react-bootstrap";

interface CreateJobModalProps {
  show: boolean;
  onHide: () => void;
  notes: string;
  title: string;
  titleColor?: "text-danger" | "text-info" | "text-success";
}

const CommonModal: React.FC<CreateJobModalProps> = (props) => {
  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title
          className={props.titleColor ? props.titleColor : "text-info"}
        >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.notes ? props.notes : "No Notes!"}</Modal.Body>
    </Modal>
  );
};

export default CommonModal;
