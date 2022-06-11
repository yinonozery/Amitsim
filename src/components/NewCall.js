import { db, auth } from "./Firebase"
import { addDoc, Timestamp, doc, getDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { React, useRef, useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import Header from "./Header";
import AdminPer from "./AdminPer";
import "./layout/roles.css";


const NewCall = () => {
    const title = useRef('');
    const description = useRef('');
    const date = useRef('');
    const address = useRef('');

    const [cats, setCats] = useState([]);
    const [types, setTypes] = useState([]);
    const [user] = useAuthState(auth)

    let callStringsRoles = [];

    const navigate = useNavigate();

    const callRoles = (callRole) => {
        console.log(callRole);
        if (!callStringsRoles.includes(callRole))
            callStringsRoles.push(callRole);
        else
            callStringsRoles.splice(callStringsRoles.indexOf(callRole), 1);
    }

    const showCats = cats.map((catTitle, indexRole) => {
        return (
            <div className="role" key={indexRole}>
                <input type="checkbox" value={indexRole} id={`0-${indexRole}`} onChange={() => callRoles(`0-${indexRole}`)} />
                <label htmlFor={`0-${indexRole}`}>{[catTitle]}</label>
            </div>
        )
    })

    const showTypes = types.map((t, indexType) => {
        return (
            <div className='types' key={indexType}>
                <select className="form__input" id='typeSelect' required>{
                    types[0].map((indexType) => {
                        return (
                            <option key={indexType} value={indexType} id={`${indexType}-${indexType}`}>{[indexType]}</option>
                        )
                    })}
                </select>
            </div>
        )
    })

    useEffect(() => {
        const getTypes = async () => {
            setTypes([]);
            const data2 = await getDocs(collection(db, 'callTypes'));
            data2.forEach((e) => {
                const subarr2 = Object.values(e.data());
                setTypes(types => [...types, subarr2]);
            });
        }
        getTypes()
    }, []);

    useEffect(() => {
        const getRoles = async () => {
            setCats([]);
            const data = await getDoc(doc(db, 'roles', 'בעלי מקצוע'))
            setCats(Object.values(data.data()));
        }
        getRoles()
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault()
        const err = document.getElementById('err');
        let errOccured = false;

        try {
            await addDoc(collection(db, "calls"), {
                name: user.displayName,
                call_name: title.current.value,
                call_date: Timestamp.fromDate(new Date(date.current.value)),
                call_type: document.getElementById('typeSelect').value,
                roles: callStringsRoles,
                call_address: address.current.value,
                is_active: true,
                description: description.current.value,
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
                setTimeout(() => navigate('/menu'), 1500);
            }
        }
    };

    return (
        <div>
            <Header />
            <AdminPer url="/newcall" />
            <br />
            <div className="box container">
                <h1 className="user-details__title title container">הוספת קריאה חדשה</h1>
            </div>
            <div className="container">
                <div className="box box--sub">
                    <form onSubmit={handleSubmit}>
                        <div className="form__group">
                            <label htmlFor="title" className="label">כותרת הקריאה: </label>
                            <input className="form__input form__input--labled" ref={title} type="text" id="title" required />
                        </div>


                        <div className="form__group">
                            <label htmlFor="date" className="label">תאריך: </label>
                            <input className="form__input form__input--labled" ref={date} type="date" id="date" required />
                        </div>

                        <h3>בעל תפקיד נדרש: </h3>
                        {/* Roles */}
                        <div id='rolesList' className='container'>
                            <div className="category">
                                {showCats}
                            </div>
                        </div>

                        <div className="form__group">
                            <label htmlFor="address" className="label">כתובת: </label>
                            <input className="form__input form__input--labled" ref={address} type="text" id="address" required />
                        </div>

                        <div className="form__group">
                            <label htmlFor="description" className="label">פירוט: </label>
                            <textarea className="form__input--labled" id="description" ref={description} rows="5" cols="30"></textarea>
                        </div>

                        <div className="form__group">
                            <label className="label">סוג הקריאה:</label>
                            {showTypes}
                        </div>

                        <button className="btn--accent" type="submit"> צור קריאה</button>
                        {/* Errors */}
                        <p id="err" className="err"></p>
                    </form>
                </div >
            </div>
        </div>
    )
}
export default NewCall;