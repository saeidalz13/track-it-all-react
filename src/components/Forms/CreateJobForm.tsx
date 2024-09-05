import { FormEvent } from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import CommonButton from "../Buttons/CommonButton";

const CreateJobForm = () => {
  const handleSubmitJob = (e: FormEvent) => {
    e.preventDefault();

    console.log(e);
  };

  return (
    <Form onSubmit={handleSubmitJob}>
      <FloatingLabel
        className="mb-2"
        controlId="floatingInput"
        label="*Position"
      >
        <Form.Control required placeholder="" type="text"></Form.Control>
      </FloatingLabel>
      <FloatingLabel controlId="floatingInput" label="*Company Name">
        <Form.Control required placeholder="" type="text"></Form.Control>
      </FloatingLabel>
      <CommonButton 
        text="Submit"
        variant="success"
        divStyle={{textAlign: "center", marginTop: "20px"}}
      />
    </Form>
  );
};

export default CreateJobForm;
