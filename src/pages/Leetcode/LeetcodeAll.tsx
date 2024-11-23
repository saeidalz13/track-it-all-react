import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Image,
  Pagination,
  InputGroup,
  Form,
  Row,
} from "react-bootstrap";
import loadingImage from "/assets/loading_spinner.svg";
import LeetcodeDetails from "@components/Modals/LeetcodeDetails";
import { ILeetcode } from "@models/Leetcode/leetcode";

interface GqlAllProblems {
  data: {
    leetcodes: Array<ILeetcode>;
  };
  errors?: Array<string>;
}

const LeetcodeAll = () => {
  const [leetcodes, setLeetcodes] = useState<
    Array<ILeetcode> | "error" | "loading"
  >("loading");
  const [offset, setOffset] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  //   const [successRate, setSuccessRate] = useState<null | number>(null)
  const [showDetails, setShowDetails] = useState(false);
  const [clickedLeetcode, setClickedLeetcode] = useState<ILeetcode | null>(
    null
  );
  const limit = 15;

  function handlePrevPage() {
    if (offset != 0) {
      setOffset((prev) => prev - limit);
    }
  }

  function handleNextPage() {
    if (offset != 10000) {
      setOffset((prev) => prev + limit);
    }
  }

  function handleDifficultyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDifficulty(e.target.value);
  }

  function handleClickDetails(leetcode: ILeetcode) {
    setClickedLeetcode(leetcode);
    setShowDetails(true);
  }

  useEffect(() => {
    async function getAllProblems() {
      try {
        const query = `
        query { 
            leetcodes(limit: ${limit}, offset: ${offset}, difficulty: ${
          difficulty ? `"${difficulty}"` : '""'
        }) {
              id
              title
              difficulty
              link
              accRate
              attempts {
                solved
                notes
              }
            }
        }`;

        const b = {
          query: query,
          variables: null,
        };

        const resp = await DataFetcher.postData(`${BACKEND_URL}/graphql`, b);

        if (resp.status === StatusCodes.OK) {
          const respBody: GqlAllProblems = await resp.json();

          if (respBody.errors === undefined) {
            setLeetcodes(respBody.data.leetcodes);
            return;
          }

          console.error(respBody.errors);
          setLeetcodes("error");
          return;
        }

        setLeetcodes("error");
        console.error(resp.status);
      } catch (error) {
        console.error(error);
      }
    }
    getAllProblems();

    return () => {
      console.log("Clean up useEffect");
    };
  }, [offset, difficulty]);

  return (
    <div>
      {leetcodes === "loading" ? (
        <Image src={loadingImage} />
      ) : leetcodes === "error" ? (
        <h1 className="text-danger mt-4 text-center">Server Error</h1>
      ) : leetcodes.length === 0 ? (
        <h2 className="text-warning">No LeetCode Problems Available</h2>
      ) : (
        <Container className="mt-4">
          <Container className="mb-3">
            <Row>
              <h4 className="text-light me-3">Filters</h4>
            </Row>
            <Row>
              <InputGroup style={{ maxWidth: "500px" }}>
                <InputGroup.Text>Difficulty</InputGroup.Text>
                <Form.Select
                  value={difficulty}
                  onChange={handleDifficultyChange}
                >
                  <option value="">--</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </InputGroup>
            </Row>
            <Row className="mt-2" style={{ maxWidth: "500px" }}>
              <InputGroup style={{ maxWidth: "500px" }}>
                <InputGroup.Text>Success Rate</InputGroup.Text>
                <Form.Control placeholder="Shows results higher than entry"></Form.Control>
              </InputGroup>
            </Row>
          </Container>

          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Acceptance Rate</th>
              </tr>
            </thead>
            <tbody>
              {leetcodes.map((leetcode) => (
                <tr key={leetcode.id}>
                  <td
                    style={{
                      cursor: "pointer",
                      color: "lightblue",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleClickDetails(leetcode)}
                  >
                    {leetcode.title}
                  </td>
                  <td>{leetcode.difficulty}</td>
                  <td>{leetcode.accRate.toPrecision(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination style={{ display: "flex", justifyContent: "center" }}>
            <Pagination.Prev onClick={handlePrevPage}></Pagination.Prev>
            <Pagination.Next onClick={handleNextPage}></Pagination.Next>
          </Pagination>
        </Container>
      )}

      <LeetcodeDetails
        show={showDetails}
        onHide={() => setShowDetails(false)}
        leetcode={clickedLeetcode}
      />
    </div>
  );
};

export default LeetcodeAll;
