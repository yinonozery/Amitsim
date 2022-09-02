import { createTheme, ThemeProvider } from "@material-ui/core";
import { heIL } from '@material-ui/core/locale'
import TableCostumized from "./TableCostumized";
import yes from '../assets/yes.png';
import no from '../assets/no.png';
import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const CallsTable = (props) => {

    const [calls, setCalls] = useState([]);
    const callsCollectionRef = collection(db, "calls");

    useEffect(() => {
        const getcalls = async () => {
            const data = await getDocs(query(callsCollectionRef, orderBy('call_date')));
            setCalls(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getcalls();
    }, []);


    const delCall = async (id) => {
        let errOccurred = false;
        await deleteDoc(doc(db, "calls", id)).catch((e) => {
            errOccurred = true;
            alert("אירעה שגיאה, נסה שנית");
        }).finally(() => {
            if (!errOccurred)
                window.location.href = "/mngcalls"
        });
    }

    const theme = createTheme({}, heIL);

    const columns = [
        {
            id: 'name',
            label: 'שם קריאה',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'date',
            label: 'תאריך',
            minWidth: 120,
            align: 'center'
        },
        {
            id: 'type',
            label: 'סוג',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('he-IL'),
        },
        {
            id: 'address',
            label: 'כתובת',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('he-IL'),
        },
        {
            id: 'isActive',
            label: 'פעיל',
            minWidth: 120,
            align: 'center',
        },
        {
            id: 'activities',
            label: 'פעולות',
            minWidth: 120,
            align: 'center',
        }
    ];

    function createData(name, date, type, address, isActive, activities) {
        return { name, date, type, address, isActive, activities };
    }


    const searchRes = calls.filter((call) => {
        const searchWord = props.search;
        if (searchWord.length < 2)
            return true;
        return call.description.includes(props.search) ||
            call.call_name.includes(props.search) ||
            call.call_address.includes(props.search) ||
            call.call_type.includes(props.search)
            ;
    });

    const rows = searchRes.map((call) => {
        let active;
        call.is_active ? active = yes : active = no;
        call.is_active ? active = yes : active = no;
        const activeImage = <img className="vx-image" src={active} alt='פעיל' />;
        const activities = <div>
            <img className="activities-icons" src="../images/edit.png" alt="עריכה" style={{ width: 25, marginLeft: 6 }} />
            <Link to="/mngcalls" onClick={() => delCall(call.uid)}><img className="activities-icons" src="../images/delete.png" alt="מחיקה" style={{ width: 25 }} /></Link>
        </div>
        return createData(call.call_name, new Date(call.call_date.seconds * 1000).toLocaleDateString(), call.call_type, call.call_address, activeImage, activities);
    })


    return (
        <ThemeProvider theme={theme}>
            <div className="box--sub container">
                <TableCostumized
                    rows={rows}
                    columns={columns}
                    rowsPerPage={10}
                    color='#8CC0DE'
                />
            </div>
        </ThemeProvider >
    )
}

export default CallsTable;