import { FetchErrorModalContent } from "@utils/fetcherUtils";
import { Modal } from "react-bootstrap";

interface FetchErrorModalProps {
  show: boolean;
  onHide: () => void;
  femc: FetchErrorModalContent;
}

const FetchErrorModal = ({ show, onHide, femc }: FetchErrorModalProps) => {
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">{femc.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{femc.body}</Modal.Body>
    </Modal>
  );
};

export default FetchErrorModal;
