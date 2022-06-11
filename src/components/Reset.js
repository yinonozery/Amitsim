import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordReset } from './Firebase';
import logo from '../assets/logo.jpg';

const Reset = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    var errOccured = false;

    const sendPassword = (event) => {
        event.preventDefault();
        const err = document.getElementById('err');
        sendPasswordReset(email)
            .catch((e) => {
                if (e.message.includes('auth/invalid-email'))
                    err.innerText = 'כתובת אימייל לא תקינה';
                else if (e.message.includes('auth/missing-email'))
                    err.innerText = 'הכנס כתובת אימייל';
                else if (e.message.includes('user-not-found'))
                    err.innerText = 'לא נמצא משתמש';
                errOccured = true;
            }).finally(() => {
                if (!errOccured) {
                    err.style.color = 'green';
                    err.innerText = 'נשלח בהצלחה ✓, הינך מועבר לדף ההתחברות';
                    setTimeout(() => { navigate("/") }, 2500);
                }
            });
    }

    return (
        <div>
            <div className="login centered">
                <div className="box container">
                    <div className="login__container container">
                        <a href="/"><img src={logo} className='logo--big' alt="Amitsim" /></a>
                        <h1 className="user-details__title title container">איפוס סיסמה</h1>
                        <form onSubmit={sendPassword}>
                            <input className="form__input" id='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='כתובת אימייל' required />
                            <p id='err' className='err'></p>
                            <button className='btn--accent'>אפס</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Reset;