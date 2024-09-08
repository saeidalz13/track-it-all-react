import { CSSProperties } from "react";

interface ProfileSectionHeaderProps {
  text: string;
}

const h1Style: CSSProperties = {
  color: "black",
  textAlign: "center",
  fontWeight: "600",
};

const ProfileSectionHeader: React.FC<ProfileSectionHeaderProps> = (props) => {
  return <h1 style={h1Style}>{props.text}</h1>;
};

export default ProfileSectionHeader;
