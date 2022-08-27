import {
    getAuth,
    updateProfile,
    updateEmail,
    updatePassword,
} from 'firebase/auth';
import {
    collection,
    getDocs,
    updateDoc,
    getDoc,
    doc,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from './Firebase';
import Header from './Header';
import '../components/layout/profile.css';
import Popup from './Popup';

const Profile = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [cats, setCats] = useState([]);
    const [catTitles, setCatTitles] = useState([]);
    const [myRoles, setMyRoles] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const password = useRef('');
    const [ssn, setSSN] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [roles, setRoles] = useState('');
    const user = getAuth();
    let failed = false;
    let refUser = '';
    let myroles = [];

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

    useEffect(() => {
        onAuthStateChanged(user, () => {
            if (user.currentUser) {
                const fullNameArr = user.currentUser.displayName.split(' ');
                setFirstName(fullNameArr[0]);
                setLastName(fullNameArr[1]);
                setEmail(user.currentUser.email);
                refUser = doc(db, 'users', user.currentUser.uid);
                getRoles();
            }
        });
    }, [user]);

    const userRoles = (userRole) => {
        setUnsavedChanges(true);
        if (!myRoles.includes(userRole)) myRoles.push(userRole);
        else myRoles.splice(myRoles.indexOf(userRole), 1);
    };

    const handlePopup = () => {
        setShowPopup((prevShowPopup) => !prevShowPopup);
    };

    const loginAndUpdate = async (event) => {
        event.preventDefault();
        const uid = user.currentUser.uid;
        const err = document.getElementById('err');
        const pass = password.current.value;
        try {
            updateProfile(user.currentUser, {
                displayName: firstName + ' ' + lastName,
            });
            updateEmail(user.currentUser, email);
            if (password.current.value !== '')
                await updatePassword(user.currentUser, pass);
        } catch (e) {
            if (e.code === 'auth/invalid-email')
                err.innerText = 'הכנס כתובת מייל תקינה';
            else if (e.code === 'auth/requires-recent-login')
                err.innerText =
                    'מטעמי בטיחות, יש להתנתק ולהתחבר מחדש על מנת לשנות את כתובת המייל';
            else err.innerText = e;
            console.log(e);
            failed = true;
        } finally {
            if (!failed) {
                // Update also in users collection
                getDocs(collection(db, 'users')).then((data) => {
                    data.forEach((doc) => {
                        if (doc.data().uid === uid) {
                            if (password !== '')
                                updateDoc(doc.ref, {
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    tel: phone,
                                    password: pass,
                                    roles: myRoles,
                                });
                            else
                                updateDoc(doc.ref, {
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    tel: phone,
                                    roles: myRoles,
                                });
                        }
                    });
                });
                err.style.color = 'green';
                err.innerText = 'פרטים עודכנו בהצלחה במערכת ✓';
                setTimeout(() => (window.location.href = '/'), 2000);
            }
        }
    };

    const showCats = (index) => {
        const div1 = document.createElement('div');
        div1.key = index;
        div1.id = 'titleCat';

        const h3 = document.createElement('h3');
        h3.innerHTML = catTitles[index];
        div1.appendChild(h3);
        document.getElementById('showCats').replaceChildren(div1);

        cats[index].forEach((role, indexRole) => {
            const div = document.createElement('div', { key: indexRole });
            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', index + '-' + indexRole);
            input.value = indexRole;
            input.onchange = () => userRoles(`${index}-${indexRole}`);

            const label = document.createElement('label');
            label.setAttribute('for', index + '-' + indexRole);
            label.textContent = role;
            div.appendChild(input);
            div.appendChild(label);

            document.getElementById('titleCat').appendChild(div);
        });

        myRoles.forEach((role) => {
            const nums = role.split('-');
            if (document.getElementById(nums[0] + '-' + nums[1]))
                document.getElementById(nums[0] + '-' + nums[1]).checked = true;
        });
    };

    const getRoles = async () => {
        let categories = [];
        await getDocs(collection(db, 'roles')).then((data) => {
            data.forEach((doc) => {
                categories.push(doc.data());
            });
        });

        const doc = await getDoc(refUser);

        myroles = doc.data().roles;
        setPhone(doc.data().tel);
        setCity(doc.data().city);
        setSSN(doc.data().ssn);

        for (let i = 0; i < myroles.length; i++) {
            setRoles(
                (roles) =>
                    roles +
                    '<li>' +
                    categories[parseInt(myroles[i][0])][
                        parseInt(myroles[i].split("-")[1])
                    ] +
                    '</li>'
            );
            setMyRoles((myRoles) => [
                ...myRoles,
                myroles[i],
            ]);
        }
        window.onload = await function () {
            document.getElementById('myroles').innerHTML = roles;
        };
    };

    return (
        <div className='user-details'>
            <Header currPage='profile' />
            <br />
            <div className='box container'>
                <h1 className='user-details__title title container'>
                    פרטי משתמש
                </h1>
            </div>
            <div className='container row'>
                <div className='box box--sub col'>
                    <div className='user-details__profile container'>
                        <h2 className='user-details__profile__title'>פרופיל</h2>
                        <form onSubmit={loginAndUpdate}>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>שם פרטי:</p>
                                <input
                                    className='property--value input'
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>שם משפחה:</p>
                                <input
                                    className='property--value input'
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>אימייל:</p>
                                <input
                                    className='property--value input'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>טלפון:</p>
                                <input
                                    type='tel'
                                    className='property--value input'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>עיר:</p>
                                <input
                                    className='property--value input'
                                    value={city}
                                    readOnly
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>תעודת זהות:</p>
                                <input
                                    className='property--value input'
                                    value={ssn}
                                    readOnly
                                />
                            </div>
                            <div className='user-details__profile__item spaced'>
                                <p className='property'>סיסמה:</p>
                                <input
                                    ref={password}
                                    type='password'
                                    className='property--value input'
                                    placeholder='הכנס סיסמה חדשה'
                                />
                            </div>
                            <p id='err' className='err'>
                                {unsavedChanges
                                    ? 'לחץ על כפתור השמירה לשמירת התפקידים'
                                    : ''}
                            </p>
                            <button className='btn--accent'>שמירה</button>
                        </form>
                    </div>
                </div>
                <div className='box box--sub'>
                    <div className='user-details__roles container'>
                        <h2 className='user-details__roles__title'>
                            רשימת תפקידים
                        </h2>
                        <ol className='user-details__roles__list' id='myroles'>
                            <div dangerouslySetInnerHTML={{ __html: roles }} />
                        </ol>
                        <button
                            className='btn--accent'
                            type='submit'
                            onClick={() => handlePopup()}>
                            עריכה
                        </button>
                    </div>
                </div>
            </div>
            <Popup
                showPopup={showPopup}
                handlePopup={handlePopup}
                title='בחר תפקידים'
                noButton={true}
                buttonText='שמירה'
                html={
                    <div>
                        <select
                            id='showCat'
                            className='form__input'
                            onChange={(e) => showCats(e.target.value)}>
                            <option defaultValue hidden>
                                בחר קטגוריה
                            </option>
                            {catTitles.map((title, index) => {
                                return (
                                    <option value={index} key={index}>
                                        {title}
                                    </option>
                                );
                            })}
                        </select>
                        <p id='showCats'></p>
                        <button className='btn--accent' onClick={handlePopup}>
                            שמירה
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default Profile;
