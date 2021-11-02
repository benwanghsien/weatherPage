import React from "react";
import photo from "../../../asset/myPhoto.jpg";

const MyPhoto = () => {
  return (
    <div className="myPhoto">
      <img src={photo} alt="作者的照片" />
    </div>
  );
};

export default MyPhoto;
