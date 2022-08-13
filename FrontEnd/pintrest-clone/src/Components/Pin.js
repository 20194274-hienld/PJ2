import React from "react";

function Pin({ pinSize, imgSrc, url }) {
  // const [anchorEl, setAnchorEl] = useState(null);
  // const array = ['Profile', 'My Account', 'Color' ]
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <div className={`pin ${pinSize}`}>
      <img src={imgSrc} alt="" className="mainPic" />
      <div className={`content ${ '' ? 'contentActive' : ''}`} >
        <div className="search">
          <a href={url}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/codewithvetriapi-c56e3.appspot.com/o/icons8-forward-arrow-100.png?alt=media&token=3f56e775-43c1-41d3-a0c4-90217b31b5be"
              alt=""
            />
          </a>

        </div>
      </div>

    </div>
  );
}

export default Pin;