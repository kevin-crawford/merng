import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

function MenuBar() {
  const pathName = window.location.pathname;
  // if path is "/" set to home, otherwise cut the / out of the pathname and set path to pathname string
  // eg: "about"
  const path = pathName === "/" ? "home" : pathName.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  // onclick handler that sets active item to item clicked to add highlight styling from semantic ui
  const handleItemClick = (e, { name }) => setActiveItem(name);

  // return menubar component
  // we can set the menu items as react router dom link components to link to page views
  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
}

export default MenuBar;
