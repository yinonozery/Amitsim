import { Link } from "react-router-dom";
import Header from "./Header";
import AdminPer from "./AdminPer";
import "./layout/menu.css";

const Menu = () => {
    return (
        <div>
            <Header />
            <AdminPer url="/menu" />
            <br />
            <div className="box container">
                <div className="menu container">
                    <Link to="/profile" className="menu__action">פרופיל</Link>
                    <Link to="/users" className="menu__action">רשימת מתנדבים</Link>
                    <Link to="/" className="menu__action">רשימת מוטבים</Link>
                    <Link to="/newevent" className="menu__action">צור אירוע חדש</Link>
                    {/* <Link to="/" className="menu__action">צור משלוח חדש</Link> */}
                    <Link to="/events" className="menu__action">אירועים קרובים</Link>
                    <Link to="/menu" className="menu__action">עדכונים</Link>
                    <Link to="/register" className="menu__action">צור משתמש חדש</Link>
                    <Link to="/dashboard" className="menu__action">דשבורד</Link>
                    <a href="https://www.amitsim.org/" className="menu__action" target="_blank" rel="noopener noreferrer">מעבר לאתר הארגון</a>
                </div>
            </div>
        </div>
    )
}

export default Menu;