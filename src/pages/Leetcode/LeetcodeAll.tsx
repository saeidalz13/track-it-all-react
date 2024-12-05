import { BACKEND_URL } from "@constants/EnvConsts";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Image,
  Pagination,
  Form,
  Row,
  Badge,
  Col,
} from "react-bootstrap";
import loadingImage from "/assets/loading_spinner.svg";
import LeetcodeDetails from "@components/Modals/LeetcodeDetails";
import { ILeetcode } from "@models/Leetcode/leetcode";
import { StringProcessor } from "@utils/stringUtils";
import { LEETCODE_TAGS } from "@constants/LeetcodeConsts";
import { useDebouncedSearch } from "@hooks/searchHooks";

interface GqlAllProblems {
  data: {
    leetcodes: {
      count: number;
      problems: Array<ILeetcode>;
    };
  };
  errors?: Array<string>;
}

const LeetcodeAll = () => {
  const [leetcodes, setLeetcodes] = useState<
    Array<ILeetcode> | "error" | "loading"
  >("loading");
  const [offset, setOffset] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const [clickedLeetcode, setClickedLeetcode] = useState<ILeetcode | null>(
    null
  );
  const [leetcodesCount, setLeetcodesCount] = useState<number>(0);
  const [solvedFilter, setSolvedFilter] = useState<string>("all");
  const limit = 15;

  const {
    searchValue: titleFilter,
    setSearchValue: setTitleFilter,
    dbncValue: dbncTitleFilter,
  } = useDebouncedSearch(1000);

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
        }, solvedFilter: "${solvedFilter}", tagFilter: "${tagFilter}", titleFilter: "${dbncTitleFilter}") {
              count
              problems {
                id
                title
                difficulty
                link
                accRate
                attempts {
                  solved
                  notes
                  language
                  createdAt
                }
                tags {
                  tag
                  link
                }
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
            setLeetcodes(respBody.data.leetcodes.problems);
            setLeetcodesCount(respBody.data.leetcodes.count);
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
  }, [offset, difficulty, solvedFilter, tagFilter, dbncTitleFilter]);

  return (
    <div>
      {leetcodes === "error" ? (
        <h1 className="text-danger mt-4 text-center">Server Error</h1>
      ) : (
        <Container className="mt-4">
          <Container className="mb-3">
            <Row className="mb-2">
              <h3 className="text-light me-3">Filters</h3>
            </Row>
            <Row>
              <Form.Group as={Col} lg>
                <Form.Label className="text-warning">Search Title</Form.Label>
                <Form.Control
                  value={titleFilter}
                  onChange={(e) => {
                    setLeetcodes("loading");
                    setTitleFilter(e.target.value);
                  }}
                  placeholder="Start typing... 🔎"
                ></Form.Control>
              </Form.Group>

              <Form.Group as={Col} style={{ maxWidth: "500px" }}>
                <Form.Label className="text-warning">Difficulty</Form.Label>
                <Form.Select
                  value={difficulty}
                  onChange={handleDifficultyChange}
                >
                  <option value="">All</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label className="text-warning">Attempt Status</Form.Label>
                <Form.Select
                  value={solvedFilter}
                  onChange={(e) => setSolvedFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="solved">Attempted</option>
                  <option value="unsolved">Not Attempted</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} style={{ maxWidth: "500px" }}>
                <Form.Label className="text-warning">Tag</Form.Label>
                <Form.Select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value={""}>All</option>
                  {LEETCODE_TAGS.map((tag) => (
                    <option value={tag.toLowerCase()}>{tag}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
          </Container>

          {leetcodes === "loading" ? (
            <div className="text-center mt-4">
              <Image height="300px" width="300px" src={loadingImage} />
            </div>
          ) : leetcodesCount === 0 ? (
            <h3 className="mt-5 text-center text-warning">
              No Problems With Current Filter
            </h3>
          ) : (
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tags</th>
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
                      }}
                      onClick={() => handleClickDetails(leetcode)}
                    >
                      {leetcode.title}
                      {"  "}
                      {leetcode.attempts.length > 0 ? (
                        <Badge bg="success" pill>
                          {leetcode.attempts.length} Attempts
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" pill>
                          No Attempts
                        </Badge>
                      )}
                    </td>
                    <td>
                      {leetcode.tags.length > 0
                        ? leetcode.tags.map((tag, index) => (
                            <span key={index}>
                              |{" "}
                              <a
                                href={tag.link}
                                target="_blank"
                                style={{
                                  color: "#7FFFD4",
                                  textDecoration: "none",
                                }}
                                onMouseOver={(
                                  e: React.MouseEvent<HTMLAnchorElement>
                                ) => {
                                  e.currentTarget.style.textDecoration =
                                    "underline";
                                }}
                                onMouseOut={(
                                  e: React.MouseEvent<HTMLAnchorElement>
                                ) => {
                                  e.currentTarget.style.textDecoration = "none";
                                }}
                              >
                                {tag.tag}
                              </a>{" "}
                              {index === leetcode.tags.length - 1 && "|"}
                            </span>
                          ))
                        : "No Tags"}
                    </td>

                    <td>
                      <span
                        style={{
                          color:
                            leetcode.difficulty === "easy"
                              ? "#00FA9A"
                              : leetcode.difficulty === "medium"
                              ? "#FFD700"
                              : "#ed2139",
                        }}
                      >
                        {StringProcessor.toTitleCase(leetcode.difficulty)}
                      </span>
                    </td>
                    <td>{leetcode.accRate.toPrecision(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {leetcodesCount <= limit ? (
            ""
          ) : (
            <Pagination style={{ display: "flex", justifyContent: "center" }}>
              <Pagination.Prev
                disabled={offset === 0}
                onClick={handlePrevPage}
              ></Pagination.Prev>
              <Pagination.Next
                // disabled={leetcodesCount / limit >= offset}
                onClick={handleNextPage}
              ></Pagination.Next>
            </Pagination>
          )}
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
