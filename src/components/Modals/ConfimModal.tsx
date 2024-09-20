import CommonButton from "@components/Buttons/CommonButton";
import { Modal } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  confirmFunc: () => void;
  body: string;
  title: string;
  titleColor?: "text-danger" | "text-info" | "text-success";
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title
          className={props.titleColor ? props.titleColor : "text-info"}
        >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body ? props.body : "No Notes!"}</Modal.Body>
      <Modal.Footer>
        <CommonButton
          text="Yes"
          variant="info"
          onClick={props.confirmFunc}
          style={{ padding: "8px 15px" }}
        />
        <CommonButton
          text="NO!"
          variant="success"
          onClick={props.onHide}
          style={{ padding: "8px 40px", fontWeight: "700" }}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
