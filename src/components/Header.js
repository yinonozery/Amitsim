import { useState, useEffect } from "react";
import { db, logout } from "./Firebase";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io"
import { FaSignOutAlt } from "react-icons/fa";
import { ClickAwayListener } from "@material-ui/core";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./layout/header.css";
import logo from '../assets/logo.jpg'
import { doc, getDoc } from "firebase/firestore";

const Header = (props) => {
    const [username, setUsername] = useState('');
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [dropdowns, setDropdowns] = useState("");
    const user = getAuth();

    const handleHamburger = () => {
        setIsNavVisible((prevIsNavVisible) => !prevIsNavVisible);
    }

    const handleDropdown = (name) => {
        dropdowns === name ? setDropdowns("") : setDropdowns(name);
    }

    const closeDropdowns = () => {
        if (dropdowns === "") return;
        setDropdowns("");
    }

    useEffect(() => {
        onAuthStateChanged(user, async () => {
            setUsername(user.currentUser.displayName);
            const refUser = doc(db, "users", user.currentUser.uid);
            const doc2 = await getDoc(refUser);
            if (doc2.data().isAdmin)
                setIsUserAdmin(true);
            else
                setIsUserAdmin(false);
        })
    }, [user]);

    return (
        <header>
            <div className="container">
                <div className="spaced">
                    <button className="nav-toggle" aria-label="open navigation" onClick={handleHamburger}>
                        <span className={isNavVisible ? "hamburger--close" : "hamburger"}></span>
                    </button>
                </div>

                <nav className={isNavVisible ? "nav nav--visible" : "nav"}>
                    <Link to="/dashboard">
                        <img src={logo} alt="אמיצים" className="header__logo logo--medium" />
                    </Link>
                    <ClickAwayListener onClickAway={closeDropdowns}>
                        {isUserAdmin ?
                            <ul className="nav__list nav__list--primary">
                                <li> <p className="nav__title">ברוך הבא, {username} |</p> </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'home' && 'nav__link--active'}`}>
                                        <Link className="nav__link" to="/dashboard">ראשי</Link>
                                    </div>
                                </li>

                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'profile' && 'nav__link--active'}`}>
                                        <Link className="nav__link" to="/profile">פרופיל</Link>
                                    </div>
                                </li>

                                <li className="nav__item" onClick={() => handleDropdown("updates")}>
                                    <div className={`nav__link ${props.currPage === 'updates' && 'nav__link--active'}`}>עדכונים <IoIosArrowDown /></div>
                                    {dropdowns === "updates" &&
                                        <ul className="dropdown-list">
                                            <li><Link to="/updates" className="dropdown__link">רשימת עדכונים</Link></li>
                                            <li><Link to="/newupdate" className="dropdown__link">יצירת עדכון</Link></li>
                                        </ul>}
                                </li>

                                <li className="nav__item" onClick={() => handleDropdown("calls")}>
                                    <div className={`nav__link ${props.currPage === 'calls' && 'nav__link--active'}`}>קריאות <IoIosArrowDown /></div>
                                    {dropdowns === "calls" &&
                                        <ul className="dropdown-list">
                                            <li><Link to="/mngcalls" className="dropdown__link">רשימת קריאות</Link></li>
                                            <li><Link to="/newcall" className="dropdown__link">יצירת קריאה</Link></li>
                                        </ul>}
                                </li>

                                <li className="nav__item" onClick={() => handleDropdown("events")}>
                                    <div className={`nav__link ${props.currPage === 'events' && 'nav__link--active'}`}>אירועים <IoIosArrowDown /></div>
                                    {dropdowns === "events" &&
                                        <ul className="dropdown-list">
                                            <li><Link to="/mngevents" className="dropdown__link">רשימת אירועים</Link></li>
                                            <li><Link to="/newevent" className="dropdown__link">יצירת אירוע</Link></li>
                                        </ul>}
                                </li>

                                <li className="nav__item" onClick={() => handleDropdown("deliveries")}>
                                    <div className="nav__link">משלוחים <IoIosArrowDown /></div>
                                    {dropdowns === "deliveries" &&
                                        <ul className="dropdown-list">
                                            <li><Link to="/" className="dropdown__link">רשימת משלוחים</Link></li>
                                            <li><Link to="/" className="dropdown__link">יצירת משלוח</Link></li>
                                        </ul>}
                                </li>
                                <li className="nav__item" onClick={() => handleDropdown("users")}>
                                    <div className={`nav__link ${props.currPage === 'users' && 'nav__link--active'}`}>משתמשים <IoIosArrowDown /></div>
                                    {dropdowns === "users" &&
                                        <ul className="dropdown-list">
                                            <li><Link to="/families" className="dropdown__link">רשימת מוטבים</Link></li>
                                            <li><Link to="/users" className="dropdown__link">רשימת משתמשים</Link></li>
                                            <li><Link to="/register" className="dropdown__link">יצירת משתמש</Link></li>
                                        </ul>}
                                </li>
                            </ul>
                            : // Else user isn't admin
                            <ul className="nav__list nav__list--primary">
                                <li> <p className="nav__title">ברוך הבא, {username} |</p> </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'home' && 'nav__link--active'}`}>
                                        <Link className="nav__link" to="/dashboard">ראשי</Link>
                                    </div>
                                </li>

                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'profile' && 'nav__link--active'}`}>
                                        <Link className="nav__link" to="/profile">פרופיל</Link>
                                    </div>
                                </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'updates' && 'nav__link--active'}`}>
                                        <Link className="nav__link" to="/updates">עדכונים</Link>
                                    </div>
                                </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'calls' && 'nav__link--active'}`}>
                                        <Link to="/calls" className="dropdown__link">קריאות</Link>
                                    </div>
                                </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'events' && 'nav__link--active'}`}>
                                        <Link to="/events" className="dropdown__link">אירועים</Link>
                                    </div>
                                </li>
                                <li className="nav__item">
                                    <div className={`nav__link ${props.currPage === 'deliveries' && 'nav__link--active'}`}>
                                        <Link to="/" className="dropdown__link">משלוחים</Link>
                                    </div>
                                </li>
                            </ul>
                        }
                    </ClickAwayListener>
                    <ul className="nav__list nav__list--secondary">
                        <li>
                            <Link className="nav__link logout" to="/" onClick={() => { logout() }}>התנתקות <FaSignOutAlt className="logout__icon" /></Link>
                        </li>
                    </ul>
                </nav>
                <br />
            </div>
        </header >
    )
}

export default Header;