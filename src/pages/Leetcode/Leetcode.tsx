import LeetcodeBreadcrumb from "@components/Breadcrumbs/LeetcodeBreadcrumb";
// import { useState } from "react";
// import { Nav } from "react-bootstrap";
import LeetcodeAll from "./LeetcodeAll";
// import LeetcodeSolved from "./LeetcodeSolved";

const Leetcode = () => {
  // const [activeTab, setActiveTab] = useState<"allproblems" | "solvedproblems">(
  //   "allproblems"
  // );

  return (
    <div>
      <LeetcodeBreadcrumb lcId={null} />

      <LeetcodeAll />

      {/* <Nav
        style={{ color: "maroon" }}
        justify
        variant="tabs"
        defaultActiveKey="alljobs"
      >
        <Nav.Item>
          <Nav.Link
            className={activeTab === "allproblems" ? "active-nav-item" : ""}
            onClick={() => setActiveTab("allproblems")}
            eventKey="alljobs"
          >
            All Problems
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={activeTab === "solvedproblems" ? "active-nav-item" : ""}
            onClick={() => setActiveTab("solvedproblems")}
            eventKey="newjob"
          >
            Solved Problems
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "allproblems" ? (
        <LeetcodeAll />
      ) : activeTab === "solvedproblems" ? (
        <LeetcodeSolved />
      ) : (
        ""
      )} */}
    </div>
  );
};

export default Leetcode;
