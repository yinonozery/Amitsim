import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import yes from '../assets/yes.png';
import no from '../assets/no.png';
import Header from "./Header";
import AdminPer from "./AdminPer";
import '../components/layout/profile.css';

const Calls = () => {
    const [calls, setCalls] = useState([]);
    const callsCollectionRef = collection(db, "calls");

    const delCall = async (id) => {
        let errOccurred = false;
        await deleteDoc(doc(db, "calls", id)).catch((e) => {
            errOccurred = true;
            alert("אירעה שגיאה, נסה שנית");
        }).finally(() => {
            if (!errOccurred)
                window.location.reload();
        });
    }

    useEffect(() => {
        const getcalls = async () => {
            const data = await getDocs(query(callsCollectionRef, orderBy('call_date')));
            setCalls(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getcalls();
    }, []);



    return (
        <div>
            <Header />
            <AdminPer url="/calls" />
            <br />
            <div className="box container">
                <h1 className="user-details__title title container">קריאות קרובות</h1>
            </div>
            <div className="table-wrapper box container">
                <table className="fl-table">
                    <thead>
                        <tr>
                            <td>שם קריאה</td>
                            <td>תאריך</td>
                            <td>סוג</td>
                            <td>תפקידים</td>
                            <td>כתובת</td>
                            <td>פעיל</td>
                            <td>מחיקה</td>
                        </tr>
                    </thead>
                    <tbody>
                        {calls.map((call) => {
                            let active, toggle;
                            call.is_active ? active = yes : active = no;
                            call.is_active ? toggle = 'השבת' : toggle = 'הפעל';
                            call.is_active ? active = yes : active = no;
                            return (
                                <tr key={call.uid}>
                                    <td>{call.call_name}</td>
                                    <td>{new Date(call.call_date.seconds * 1000).toLocaleDateString()}</td>
                                    <td>{call.type}</td>
                                    <td>{call.roles}</td>
                                    <td>{call.call_address}</td>
                                    <td>
                                        <img src={active} alt='' />
                                    </td>
                                    <td>
                                        <img src="../images/edit.png" alt="עריכה" />
                                        <a onClick={() => delCall(call.uid)} href="#"><img src="../images/delete.png" alt="מחיקה" /></a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Calls; 