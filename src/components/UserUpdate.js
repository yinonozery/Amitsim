import "./layout/userUpdates.css";
import { useState } from "react";
import { MdClose } from 'react-icons/md';
import { db } from "./Firebase";
import { deleteDoc, doc } from "firebase/firestore";

function UserUpdate(props) {
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const delUpdate = async (id) => {
    let errOccurred = false;
    console.log(id);
    await deleteDoc(doc(db, "updates", id)).catch((e) => {
      errOccurred = true;
      alert("אירעה שגיאה, נסה שנית");
    }).finally(() => {
      if (!errOccurred)
        window.location.href = "/updates"
    });
  }

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
        <div className="update__left">
          {props.isUserAdmin && <MdClose className="update__delete-btn"
            aria-label="delete update"
            onClick={() => delUpdate(props.uid)}
          /> }
          <small className="update__date">{props.date}</small>
        </div>
      </div>
    </div>
  );
}

export default UserUpdate;
