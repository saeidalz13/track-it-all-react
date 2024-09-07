import { CSSProperties } from "react"

const h1Style: CSSProperties = {
    color: "black",
    textAlign: "center",
    fontWeight: "600"
}

const JobsHeader = () => {
  return (
    <h1 style={h1Style}>Recent Applications</h1>
  )
}

export default JobsHeader