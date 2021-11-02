import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="navbar">
      <div className="nav-wrap">
        <h1 className="title">
          <Link to="/">
            <i className="twicon-main-island"></i>台灣天氣資訊網
          </Link>
        </h1>
        <div className="toggle-btn">
          <div className="hamburger"></div>
        </div>
        <ul>
          <li>
            <Link to="/">天氣預報</Link>
          </li>
          <li>
            <Link to="/about">關於作者</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
