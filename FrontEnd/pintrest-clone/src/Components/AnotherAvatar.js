import React from "react";

function AnotherAvatar({ pinSize, imgSrc, name, url }) {
    return (
        <div className={`pin ${pinSize}`}>
      <img src={imgSrc} alt="" className="mainPic" />
      <div className="contentFollow">
        <a href={url} className="node-text">
          <h3>{name}</h3>
        </a>
      </div>
    </div>
    );
}

export default AnotherAvatar;