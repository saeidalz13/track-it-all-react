import { useState } from "react";
import { Nav } from "react-bootstrap";
import JobsBreadcrumb from "../JobsBreadcrumb";
import AppliedJobsTab from "./AppliedJobsTab";
import CreateJobTab from "./CreateJobTab";

const AllJobs = () => {
  const [activeTab, setActiveTab] = useState<"alljobs" | "newjob">("alljobs");

  return (
    <div>
      <JobsBreadcrumb jobUlid={null} />

      <Nav
        style={{ color: "maroon" }}
        justify
        variant="tabs"
        defaultActiveKey="alljobs"
      >
        <Nav.Item>
          <Nav.Link
            className={activeTab === "alljobs" ? "active-nav-item" : ""}
            onClick={() => setActiveTab("alljobs")}
            eventKey="alljobs"
          >
            All Jobs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={activeTab === "newjob" ? "active-nav-item" : ""}
            onClick={() => setActiveTab("newjob")}
            eventKey="newjob"
          >
            Create Job Application
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "newjob" ? (
        <CreateJobTab />
      ) : activeTab === "alljobs" ? (
        <AppliedJobsTab />
      ) : (
        ""
      )}
    </div>
  );
};

export default AllJobs;
