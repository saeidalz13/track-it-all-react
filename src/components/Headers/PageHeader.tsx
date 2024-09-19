import { Container } from "react-bootstrap";

const PageHeaderStyle: React.CSSProperties = {
  backgroundColor: "black",
  color: "#e0e0e0",
  textAlign: "center",
  fontSize: "clamp(30px, 6vw, 60px)",
  fontFamily: "Raleway",
  padding: "4vh 5vw ",
};

interface PageHeaderProps {
  text: string;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <Container style={PageHeaderStyle} fluid>
      <span>
        <span style={{ color: "#00de00" }}>{">"}_</span> trackItAll.
        <span style={{ color: "#00de00" }}>{props.text}</span>
      </span>
    </Container>
  );
};

export default PageHeader;
