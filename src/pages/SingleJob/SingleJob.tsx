import { useParams } from "react-router-dom";

const SingleJob = () => {
  const { jobUlid } = useParams();

  console.log(jobUlid);

  return <div>SingleJob</div>;
};

export default SingleJob;
