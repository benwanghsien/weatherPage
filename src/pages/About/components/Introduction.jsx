import React from "react";
import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <div className="introduction">
      <h2>關於作者 王孝先</h2>
      <p>
        曾經是職能治療師、西餐廚師，正在前往轉職網頁前端工程師的路途中。
        <br />
        開始接觸教學課程前，從來沒有寫過程式的經驗。為了處理餐廳行政作業學習簡單Excel內建函式，發覺對於寫程式的興趣，進而透過線上教學課程自學程式語言，踏上轉職前端工程師的道路。
      </p>

      <h2>技能</h2>
      <ul>
        <li>HTML、CSS、JavaScript</li>
        <li>React</li>
      </ul>
      <h2>自學成果</h2>
      <ul>
        <li>
          <Link to="/">Todo-List</Link>
        </li>
      </ul>
    </div>
  );
};

export default Introduction;
