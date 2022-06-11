import { db, auth } from "./Firebase"
import { addDoc, Timestamp } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { React, useRef } from "react";
import { FaRegCalendarPlus } from "react-icons/fa"
import { collection } from "firebase/firestore";
import Header from "./Header";
import AdminPer from "./AdminPer";
import "./layout/roles.css";


const NewUpdate = () => {
    const title = useRef('');
    const msg = useRef('');
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const err = document.getElementById('err');
        let errOccured = false;

        try {
            await addDoc(collection(db, "updates"), {
                author: user.displayName,
                title: title.current.value,
                msg: msg.current.value,
                created: Timestamp.now()
            })
        } catch (e) {
            errOccured = true;
            err.style.color = 'red';
            err.innerText = 'אירעה שגיאה ביצירת קריאה, נסה/י שנית';
            console.error(e);
        } finally {
            if (!errOccured) {
                err.style.color = 'green';
                err.innerText = ' נרשם בהצלחה ✓';
                setTimeout(() => navigate('/'), 1500);
            }
        }
    };

    return (
        <div>
            <Header />
            <AdminPer url="/newupdate" />
            <br />
            <div className="box container">
                <h1 className="event-details__title title container">הוספת עדכון חדש</h1>
            </div>
            <div className="container row">
                <div className="event-details box box--sub col">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <div className="form__group">
                                <span className="label">כותרת : </span>
                                <input className="form__input form__input--labled"
                                    ref={title}
                                    type="text"
                                    name="title"
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <span className="label">פירוט: </span>
                                <textarea className="event-description form__input--labled"
                                    ref={msg}
                                    id="desc"
                                    rows="4"
                                    cols="20"
                                >
                                </textarea>
                            </div>

                            <button className="edit-btn btn--accent" type="submit">
                                <div className="spaced">
                                    <p>הוספת עדכון</p>
                                    <div className="btn__icon btn__icon--create-event"><FaRegCalendarPlus /></div>
                                </div>
                            </button>
                            {/* Errors */}
                            <p id="err" className="err"></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewUpdate;