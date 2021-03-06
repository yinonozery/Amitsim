import { React, useRef, useState, useEffect } from "react";
import { db, registerWithEmailAndPassword } from "./Firebase";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AdminPer from "./AdminPer";
import { FaUserPlus } from "react-icons/fa"
import "./layout/roles.css"

const Register = () => {
    const email = useRef("");
    const fullName = useRef("");
    const gender = useRef("");
    const tel = useRef("");
    const city = useRef("");
    const ssn = useRef("");
    const [cats, setCats] = useState([]);
    const [catTitles, setCatTitles] = useState([]);

    let userStringsRoles = [];
    const navigate = useNavigate();

    const userRoles = (userRole) => {
        if (!userStringsRoles.includes(userRole))
            userStringsRoles.push(userRole);
        else
            userStringsRoles.splice(userStringsRoles.indexOf(userRole), 1);
    }

    const showCats = cats.map((subcat, indexCat) => {
        return (
            <div className='category' key={indexCat}>
                <h3 className="register__title">{catTitles[indexCat]}</h3>
                {subcat.map((role, indexRole) => {
                    return (
                        <div className="role" key={indexRole}>
                            <input type="checkbox" value={indexRole} id={`${indexCat}-${indexRole}`} onChange={() => userRoles(`${indexCat}-${indexRole}`)} />
                            <label htmlFor={`${indexCat}-${indexRole}`}>{role}</label>
                        </div>
                    )
                })}
            </div>
        )
    })

    useEffect(() => {
        const getRoles = async () => {
            setCats([]);
            const data = await getDocs(collection(db, 'roles'));
            data.forEach((e) => {
                const subarr = Object.values(e.data());
                setCatTitles(catTitles => [...catTitles, e.id]);
                setCats(cats => [...cats, subarr]);
            });
        }
        getRoles();
    }, []);

    function is_israeli_id_number(id) {
        id = String(id).trim();
        if (id.length > 9 || isNaN(id)) return false;
        id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
        return Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) % 10 === 0;
    }

    const register = (event) => {
        event.preventDefault();
        const err = document.getElementById('err');
        if (is_israeli_id_number(ssn.current.value) === false) {
            err.style.color = 'red';
            err.innerText = '???????? ?????????? ???????? ???????? ????????, ??????/?? ????????';
            return;
        }

        const password = (Math.random().toString(15).substring(2, 20));
        let errOccured = false;

        try {
            registerWithEmailAndPassword(fullName.current.value, ssn.current.value, email.current.value, password, gender.current.value, tel.current.value, city.current.value, userStringsRoles);
        } catch (e) {
            errOccured = true;
            err.style.color = 'red';
            err.innerText = '?????????? ?????????? ????????????, ??????/?? ????????';
            console.error(e);
        } finally {
            if (!errOccured) {
                err.style.color = 'green';
                err.innerText = fullName.current.value + ' ???????? ???????????? ???';
                setTimeout(() => navigate('/'), 1000);
            }
        }
    };

    return (
        <div>
            <Header currPage="users" />
            <AdminPer url="/register" />
            <br />
            <div className="box container">
                <h1 className="user-details__title title container">?????????? ?????????? ??????</h1>
            </div>
            <br />
            <div className="box container">
                <form className="login__form" onSubmit={register}>
                    <input ref={fullName} className="form__input" type="text" placeholder="???? ??????" required />
                    <input ref={ssn} className="form__input" type="number" placeholder="?????????? ????????" required />
                    <select ref={gender} className="form__input" defaultValue={"default"}>
                        <option value="default" disabled>?????? ????????</option>
                        <option value="??????">??????</option>
                        <option value="????????">????????</option>
                        <option value="??????">??????</option>
                    </select>
                    <input ref={email} className="form__input" type="email" placeholder="?????????? ????????????" required />
                    <input ref={tel} className="form__input" type="tel" placeholder="???????? ????????????" required />
                    <input ref={city} className="form__input" type="text" placeholder="??????" required />
                    <h2>?????? ??????????????:</h2>
                    {/* Roles */}
                    <div id='rolesList' className='container'>
                        {showCats}
                    </div>

                    {/* Errors */}
                    <p id="err" className="err"></p>
                    <br />
                    <p className="register__description">?????????? ???????????? ?????????? ???????????? ?????????? ???? ???????????? ???????? ?????????? ????????????</p>

                    <button className="edit-btn btn--accent" type="submit">
                        <div className="spaced">
                            <p>?????????? ??????????</p>
                            <div className="btn__icon btn__icon--create-event"><FaUserPlus /></div>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;