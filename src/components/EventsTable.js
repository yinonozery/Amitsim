import { createTheme, ThemeProvider } from "@material-ui/core";
import { heIL } from '@material-ui/core/locale'
import TableCostumized from "./TableCostumized";
import { Link } from "react-router-dom";
import yes from '../assets/yes.png';
import no from '../assets/no.png';
import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import Export from "./Export";

const EventsTable = (props) => {
    const [events, setEvents] = useState([]);
    const eventsCollectionRef = collection(db, "events");
    const delEvent = async (id) => {
        let errOccurred = false;
        await deleteDoc(doc(db, "events", id)).catch((e) => {
            errOccurred = true;
            alert("אירעה שגיאה, נסה שנית");
        }).finally(() => {
            if (!errOccurred)
                window.location.reload();
        });
    }

    useEffect(() => {
        const getEvents = async () => {
            const data = await getDocs(query(eventsCollectionRef, orderBy('event_date')));
            setEvents(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getEvents();
    }, []);


    const theme = createTheme({}, heIL);

    const columns = [
        {
            id: 'name',
            label: 'שם האירוע',
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
            id: 'creator',
            label: 'יוצר',
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

    function createData(name, date, type, creator, isActive, activities) {
        return { name, date, type, creator, isActive, activities };
    }

    const searchRes = events.filter((event) => {
        const searchWord = props.search;
        if (searchWord.length < 2)
            return true;
        return event.description.includes(props.search) ||
            event.event_name.includes(props.search) ||
            event.location.includes(props.search)
            ;
    });

    const rows = searchRes.map((event) => {
        let active;
        event.is_active ? active = yes : active = no;
        event.is_active ? active = yes : active = no;
        const activeImage = <img className="vx-image" src={active} alt='פעיל' />;
        const activities = <div>
            <img className="activities-icons" src="../images/edit.png" alt="עריכה" />
            <Link onClick={() => delEvent(event.uid)} to="/mngevents"><img className="activities-icons" src="../images/delete.png" alt="מחיקה" /></Link>
        </div>
        return createData(event.event_name, new Date(event.event_date.seconds * 1000).toLocaleDateString(), event.type, event.name, activeImage, activities);
    })

    return (
        <ThemeProvider theme={theme}>
            <div className="box--sub container">
                <TableCostumized
                    rows={rows}
                    columns={columns}
                    rowsPerPage={10}
                    color='#FFA1A1'
                />
                <br />
                <Export type="events" />
            </div>
        </ThemeProvider >
    )
}

export default EventsTable;