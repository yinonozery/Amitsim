import { useState } from 'react';
import './layout/userUpdates.css';

function UserUpdate(props) {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <div className="update">
            <div className="update--wrapper container">
                <div className="update__details">
                    <h2 className="update__details__title"> {props.author} - {props.title} </h2>
                    <p className="update__details__msg">{isReadMore ? props.msg.slice(0, 65) : props.msg}&nbsp;&#9679;&nbsp;
                        <span onClick={toggleReadMore} className='read-more-btn'>{isReadMore ? "קרא עוד..." : "הראה פחות"}</span>
                    </p>
                </div>
                <div className="update__date">
                    <small>{props.date}</small>
                </div>
            </div>
        </div>

    )
}

export default UserUpdate;