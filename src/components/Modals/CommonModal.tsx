import { Modal } from "react-bootstrap";

interface CommonModalProps {
  show: boolean;
  onHide: () => void;
  body: string;
  title: string;
  titleColor?: "text-danger" | "text-info" | "text-success";
}

const CommonModal: React.FC<CommonModalProps> = (props) => {
  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title
          className={props.titleColor ? props.titleColor : "text-info"}
        >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
    </Modal>
  );
};

export default CommonModal;
