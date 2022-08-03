import { useState } from "react";
import "./layout/userUpdates.css";

function UserUpdate(props) {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div className="update">
      <div className="update--wrapper container">
        <div className="update__details">
          <h2 className="update__details__title"> {props.title}</h2>
          <p className="update__details__msg">
            {isReadMore ? props.msg.slice(0, 65) + "..." : props.msg}
            {props.msg.length > 65 ? (
              <span>
                &nbsp;&#9679;&nbsp;
                <span onClick={toggleReadMore} className="read-more-btn">
                  {isReadMore ? "קרא עוד..." : "הראה פחות"}
                </span>
              </span>
            ) : null}
            <p className="msg-by">
              <u>מאת:</u> {props.author}
            </p>
          </p>
        </div>
        <div className="update__date">
          <small>{props.date}</small>
        </div>
      </div>
    </div>
  );
}

export default UserUpdate;
