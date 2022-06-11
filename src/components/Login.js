import { useState } from "react";
import { Link } from "react-router-dom";
import { logInWithEmailAndPassword } from "./Firebase";
import logo from '../assets/logo.jpg';
import AdminPer from "./AdminPer";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let errOccured = false;

    const login = event => {
        event.preventDefault();
        const err = document.getElementById('err');
        logInWithEmailAndPassword(email, password).catch((e) => {
            if (email === '')
                err.innerText = 'לא הוכנסה כתובת אימייל';
            else if (e.message.includes('user-not-found'))
                err.innerHTML = 'לא נמצא משתמש';
            else if ((e.message.includes('internal-error') || e.message.includes('wrong-password')))
                err.innerHTML = 'בדוק פרטי התחברות ונסה שנית';
            else if (e.message.includes('too-many-requests'))
                err.innerHTML = 'עכב נסיונות התחברות מרובים, החשבון ננעל זמנית. נסה מאוחר יותר או שחזר את הסיסמה';
            errOccured = true;
        }).finally(() => {
            if (!errOccured) {
                err.style.color = 'green';
                err.innerText = 'התחברת בהצלחה ✓, הינך מועבר לאיזור האישי';
            }
        });
    }
    return (
        <div className="login centered">
            <div className="box container">
                <div className="login__container container">
                    <a href="/"><img src={logo} className='logo--big' alt="Amitsim" /></a>
                    <div>
                        
                        <h1 className="form__title title">התחברות מתנדבים</h1>
                        <form className="login__form" onSubmit={login}>
                            <input className="form__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="כתובת אימייל" autoComplete="username" required />
                            <input className="form__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה" autoComplete="current-password" required />
                            <p id="err" className="err"></p>
                            <button className="form__btn btn--accent" type="submit">התחברות</button>
                        </form>
                        <div className="form__links">
                            <Link to="/reset" className="form__link small"><small>שכחת את הסיסמה?</small></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;