import { React, useRef, useState, useEffect } from 'react';
import { db, registerWithEmailAndPassword } from './Firebase';
import { getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AdminPer from './AdminPer';
import { FaUserPlus } from 'react-icons/fa';
import './layout/roles.css';

const Register = () => {
    const email = useRef('');
    const firstName = useRef('');
    const lastName = useRef('');
    const gender = useRef('');
    const tel = useRef('');
    const city = useRef('');
    const ssn = useRef('');
    const [cats, setCats] = useState([]);
    const [catTitles, setCatTitles] = useState([]);

    let userStringsRoles = [];
    const navigate = useNavigate();

    const userRoles = (userRole) => {
        if (!userStringsRoles.includes(userRole))
            userStringsRoles.push(userRole);
        else userStringsRoles.splice(userStringsRoles.indexOf(userRole), 1);
    };

    const showCats = cats.map((subcat, indexCat) => {
        return (
            <div className='category' key={indexCat}>
                <h3 className='register__title'>{catTitles[indexCat]}</h3>
                {subcat.map((role, indexRole) => {
                    return (
                        <div className='role' key={indexRole}>
                            <input
                                type='checkbox'
                                value={indexRole}
                                id={`${indexCat}-${indexRole}`}
                                onChange={() =>
                                    userRoles(`${indexCat}-${indexRole}`)
                                }
                            />
                            <label htmlFor={`${indexCat}-${indexRole}`}>
                                {role}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    });

    useEffect(() => {
        const getRoles = async () => {
            setCats([]);
            const data = await getDocs(collection(db, 'roles'));
            data.forEach((e) => {
                const subarr = Object.values(e.data());
                setCatTitles((catTitles) => [...catTitles, e.id]);
                setCats((cats) => [...cats, subarr]);
            });
        };
        getRoles();
    }, []);

    const checkIdExists = async (id) => {
        let found = false;
        const data = await getDocs(collection(db, 'users'));
        data.forEach((e) => {
            if (e.data().ssn === id) found = true;
        });
        return found;
    };

    function is_israeli_id_number(id) {
        id = String(id).trim();
        if (id.length > 9 || isNaN(id)) return false;
        id = id.length < 9 ? ('00000000' + id).slice(-9) : id;
        return (
            Array.from(id, Number).reduce((counter, digit, i) => {
                const step = digit * ((i % 2) + 1);
                return counter + (step > 9 ? step - 9 : step);
            }) %
                10 ===
            0
        );
    }

    const register = (event) => {
        event.preventDefault();
        const err = document.getElementById('err');
        if (is_israeli_id_number(ssn.current.value) === false) {
            err.style.color = 'red';
            err.innerText = 'מספר תעודת הזהות אינו תקין, נסה/י שנית';
            return;
        }
        if (checkIdExists(ssn.current.value)) {
            err.style.color = 'red';
            err.innerText = 'מספר תעודת הזהות כבר בשימוש במערכת, נסה/י שנית';
            return;
        }
        const password = Math.random().toString(15).substring(2, 20);
        let errOccured = false;

        try {
            registerWithEmailAndPassword(
                firstName.current.value,
                lastName.current.value,
                ssn.current.value,
                email.current.value,
                password,
                gender.current.value,
                tel.current.value,
                city.current.value,
                userStringsRoles
            );
        } catch (e) {
            errOccured = true;
            err.style.color = 'red';
            err.innerText = 'אירעה שגיאה בהרשמה, נסה/י שנית';
            console.error(e);
        } finally {
            if (!errOccured) {
                err.style.color = 'green';
                err.innerText =
                    firstName.current.value +
                    ' ' +
                    lastName.current.value +
                    'נרשם בהצלחה ✓';
                setTimeout(() => navigate('/'), 1000);
            }
        }
    };

    return (
        <div>
            <Header currPage='users' />
            <AdminPer url='/register' />
            <br />
            <div className='box container'>
                <h1 className='user-details__title title container'>
                    רישום מתנדב חדש
                </h1>
            </div>
            <br />
            <div className='box container'>
                <form className='login__form' onSubmit={register}>
                    <input
                        ref={firstName}
                        className='form__input'
                        type='text'
                        placeholder='שם פרטי'
                        required
                    />
                    <input
                        ref={lastName}
                        className='form__input'
                        type='text'
                        placeholder='שם משפחה'
                        required
                    />
                    <input
                        ref={ssn}
                        className='form__input'
                        type='number'
                        placeholder='תעודת זהות'
                        required
                    />
                    <select
                        ref={gender}
                        className='form__input'
                        defaultValue={'default'}>
                        <option value='default' disabled>
                            בחר מגדר
                        </option>
                        <option value='זכר'>זכר</option>
                        <option value='נקבה'>נקבה</option>
                        <option value='אחר'>אחר</option>
                    </select>
                    <input
                        ref={email}
                        className='form__input'
                        type='email'
                        placeholder='כתובת אימייל'
                        required
                    />
                    <input
                        ref={tel}
                        className='form__input'
                        type='tel'
                        placeholder='מספר פלאפון'
                        required
                    />
                    <input
                        ref={city}
                        className='form__input'
                        type='text'
                        placeholder='עיר'
                        required
                    />
                    <h2>בחר תפקידים:</h2>
                    {/* Roles */}
                    <div id='rolesList' className='container'>
                        {showCats}
                    </div>

                    {/* Errors */}
                    <p id='err' className='err'></p>
                    <br />
                    <p className='register__description'>
                        סיסמה אקראית תישלח לכתובת המייל של המתנדב בסוף תהליך
                        הרישום
                    </p>

                    <button className='edit-btn btn--accent' type='submit'>
                        <div className='spaced'>
                            <p>יצירת משתמש</p>
                            <div className='btn__icon btn__icon--create-event'>
                                <FaUserPlus />
                            </div>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
