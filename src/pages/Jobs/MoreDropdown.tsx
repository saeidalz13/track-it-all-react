import React from "react";
import { DropdownButton, DropdownItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";

interface MoreDropdownProps {
  title: string;
  dropdownItemTitles: Map<string, string>;
  variant?: string;
  menuVariant?: string;
  style?: React.CSSProperties;
}

const MoreDropdown: React.FC<MoreDropdownProps> = (props) => {
  return (
    <DropdownButton
      variant={props.variant ? props.variant : "success"}
      menuVariant={props.menuVariant ? props.menuVariant : "dark"}
      title={props.title}
    >
      {[...props.dropdownItemTitles.entries()].map(([title, url]) => (
        <NavLink key={url} to={url}>
          <DropdownItem 
          >{title}</DropdownItem>
        </NavLink>
      ))}
    </DropdownButton>
  );
};

export default MoreDropdown;
