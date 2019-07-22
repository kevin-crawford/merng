import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

function MenuBar() {
  // destructure user and logout function from auth context
  const { user, logout } = useContext(AuthContext);
  const pathName = window.location.pathname;
  // if path is "/" set to home, otherwise cut the / out of the pathname and set path to pathname string
  // eg: "about"
  const path = pathName === "/" ? "home" : pathName.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  // onclick handler that sets active item to item clicked to add highlight styling from semantic ui
  const handleItemClick = (e, { name }) => setActiveItem(name);

  // create menuBar variable which checks if there is a user logged in by checking the authContext
  // if user is true, show a menu bar which has username in the left
  // and a logout button ( onclick handler is set to the logout function from authcontext)

  // if user is false, show the default menu bar with login and registration buttons

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item name={user.username} active as={Link} to="/" />
      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
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
  return menuBar;
}

export default MenuBar;
