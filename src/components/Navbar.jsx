import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ title }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">{title}</h1>
        <div className="navbar-links">
          <Link to="/active" className="navbar-link">
            My Lists
          </Link>
          <Link to="/shared" className="navbar-link">
            Shared
          </Link>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
