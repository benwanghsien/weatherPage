import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  let [toggled, setToggled] = useState(true);

  const handleToggledBtn = (e) => {
    setToggled((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="nav-wrap">
        <h1 className="title">
          <Link to="/weatherPage">
            <i className="twicon-main-island"></i>台灣天氣資訊網
          </Link>
        </h1>
        <div className="toggle-btn" onClick={handleToggledBtn}>
          <div className={`hamburger ${toggled ? "isX" : ""}`}></div>
        </div>
        <ul className={`${toggled ? "toggled" : ""}`}>
          <li>
            <Link to="/weatherPage">天氣預報</Link>
          </li>
          <li>
            <Link to="/weatherPage/about">關於作者</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
