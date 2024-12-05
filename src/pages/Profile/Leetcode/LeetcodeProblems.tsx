import { BACKEND_URL } from "@constants/EnvConsts";
import { IRecentLeetcode } from "@models/Leetcode/leetcode";
import { DataFetcher } from "@utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import loadingImage from "/assets/loading_spinner.svg";
import { Col, Container, Image, Row } from "react-bootstrap";

const noProblemDivStyle: React.CSSProperties = {
  fontSize: "25px",
  fontWeight: "500",
  color: "maroon",
  marginTop: "20px",
};

interface GqlRecentLeetcodes {
  data: {
    recentLeetcodes: Array<IRecentLeetcode>;
  };
  errors?: Array<string>;
}

const LeetcodeProblems = () => {
  const [recentLeetcodes, setRecentLeetcodes] = useState<
    Array<IRecentLeetcode> | "loading" | "error"
  >("loading");

  useEffect(() => {
    async function fetchRecentLeetcodes() {
      try {
        const query = `
        query {
          recentLeetcodes {
            id
            title
            difficulty
            link
          }
        }
        `;

        const b = {
          query: query,
          variables: null,
        };

        const resp = await DataFetcher.postData(`${BACKEND_URL}/graphql`, b);

        if (resp.status === StatusCodes.OK) {
          const respBody: GqlRecentLeetcodes = await resp.json();

          if (respBody.errors === undefined) {
            setRecentLeetcodes(respBody.data.recentLeetcodes);
          } else {
            console.error(respBody.errors);
          }
          return;
        }

        setRecentLeetcodes("error");
        console.error(resp.status);
      } catch (error) {
        console.error(error);
        setRecentLeetcodes("error");
      }
    }

    fetchRecentLeetcodes();
  }, []);

  return (
    <div>
      {recentLeetcodes === "error" ? (
        <h1 className="text-danger mt-4 text-center">Server Error</h1>
      ) : recentLeetcodes === "loading" ? (
        <div className="text-center mt-4">
          <Image height="100px" width="100px" src={loadingImage} />
        </div>
      ) : recentLeetcodes.length === 0 ? (
        <div style={noProblemDivStyle}>No Solved Leetcode Yet!</div>
      ) : (
        <Container>
          <Row>
            {recentLeetcodes.map((rc) => (
              <Col
                key={rc.id}
                style={{
                  fontSize: "14px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "15px",
                  padding: "16px",
                  margin: "12px",
                  backgroundColor: "#FAF7F0",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "black",
                  }}
                >
                  {rc.title}
                </div>
                <div
                  style={{
                    marginBottom: "8px",
                    color:
                      rc.difficulty === "easy"
                        ? "#4caf50"
                        : rc.difficulty === "medium"
                        ? "#ffa726"
                        : "#f44336",
                    fontWeight: "600",
                  }}
                >
                  Difficulty: {rc.difficulty}
                </div>
                <div>
                  <a
                    href={rc.link}
                    target="_blank"
                    style={{
                      color: "#1976d2",
                      fontWeight: "500",
                    }}
                  >
                    Go To Leetcode Website
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default LeetcodeProblems;
