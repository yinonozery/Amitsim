import { createTheme, ThemeProvider } from '@material-ui/core';
import { heIL } from '@material-ui/core/locale';
import TableCostumized from './TableCostumized';
import { Link } from 'react-router-dom';
import yes from '../assets/yes.png';
import no from '../assets/no.png';
import { useState, useEffect } from 'react';
import { db } from './Firebase';
import {
    collection,
    getDocs,
    orderBy,
    query,
    deleteDoc,
    doc,
    getDoc,
} from 'firebase/firestore';
import Export from './Export';
import Popup from './Popup';
import Spinner from './Spinner';

const EventsTable = (props) => {
    const [events, setEvents] = useState([]);
    const [, setCatTitles] = useState([]);
    const [cats, setCats] = useState([]);
    const [popupButtonToggle, setPopupButtonToggle] = useState(false);
    const [popupTitle, setPopupTitle] = useState(false);
    const [loading, setLoading] = useState(false);

    const eventsCollectionRef = collection(db, 'events');

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
        const getEvents = async () => {
            const data = await getDocs(
                query(eventsCollectionRef, orderBy('event_date'))
            );
            setEvents(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        };
        getEvents();
    }, []);

    useEffect(() => {
        setLoading(true);
        const getEvents = async () => {
            const data = await getDocs(
                query(eventsCollectionRef, orderBy('event_date'))
            );
            setEvents(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
            setLoading(false);
        };
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
            align: 'center',
        },
        {
            id: 'hours',
            label: 'שעות',
            minWidth: 120,
            align: 'center',
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
            minWidth: 40,
            align: 'center',
        },
        {
            id: 'details',
            label: '',
            minWidth: 100,
            align: 'center',
        },
        {
            id: 'removeEvent',
            label: '',
            minWidth: 40,
            align: 'center',
        },
    ];

    function createData(
        name,
        date,
        hours,
        type,
        creator,
        isActive,
        details,
        removeEvent
    ) {
        return { name, date, hours, type, creator, isActive, details, removeEvent };
    }

    const searchRes = events.filter((event) => {
        const searchWord = props.search;
        if (searchWord.length < 2) return true;
        return (
            event.description.includes(props.search) ||
            event.event_name.includes(props.search) ||
            event.location.includes(props.search)
        );
    });

    const [popupHTML, setPopupHTML] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handlePopup = () => {
        setShowPopup((prevShowPopup) => !prevShowPopup);
    };

    const deleteEvent = async (id) => {
        let errOccurred = false;
        alert('OK');
        // await deleteDoc(doc(db, 'events', id))
        //     .catch((e) => {
        //         errOccurred = true;
        //         alert('אירעה שגיאה, נסה שנית');
        //     })
        //     .finally(() => {
        //         if (!errOccurred) window.location.reload();
        //     });
    };

    const delEvent = async (id) => {
        setPopupButtonToggle(true);
        setPopupTitle('מחיקת אירוע');
        setPopupHTML(`
        <div class='delete-event'>
            <p>האם אתה בטוח?</p>
            <button class='btn--check'>כן</button>
            <button class='btn--accent'>לא</button>
        </div>
        `);
    };

    let rolesHTML = '';
    let pr = '';
    const openDetails = async (uid) => {
        const docRef = doc(db, 'events', uid);
        const docSnap = await getDoc(docRef);
        const event = docSnap.data();

        await event.roles.map(async (roleSplit) => {
            const r = roleSplit.split('-');
            rolesHTML += `<li><span>${cats[r[0]][r[1]]} - נותרו ${r[2]}</span>`;
            const userRef = r[0] + '-' + r[1];
            if (event.users[userRef].length > 0) {
                rolesHTML += '<p>רשומים:<br />';

                // Get users first names
                for (let i = 0; i < event.users[userRef].length; i++) {
                    await getDoc(event.users[userRef][i]).then((e) => {
                        rolesHTML += `<li>${e.data().firstName}</li>`;
                    });
                }
                rolesHTML += pr + '</p></li>';
                console.log(pr);
            }
        });

        setPopupTitle('פרטי אירוע');
        setPopupButtonToggle(true);
        setPopupHTML(`
        <div className="event_details">
        <p>
        <h4>שם</h4>
        ${event.event_name}</p>
        <p>
        <h4>תאריך</h4> 
        ${event.event_date.toDate().toLocaleDateString('he-IL')}</p>
        <div>
        <h4>תפקידים</h4>
        <ul>
        ${rolesHTML}
        </ul>
        </div>
        </div>
        `);
    };

    const rows = searchRes.map((event) => {
        let active, hours;
        event.event_start &&
            event.event_end &&
            (hours = `${event.event_start}-${event.event_end}`);
        event.is_active ? (active = yes) : (active = no);
        event.is_active ? (active = yes) : (active = no);
        const activeImage = (
            <img className='vx-image' src={active} alt='פעיל' />
        );
        const details = (
            <div>
                <button
                    className='btn'
                    onClick={() => {
                        openDetails(event.uid);
                        handlePopup();
                    }}
                    >
                    פרטים
                </button>
            </div>
        );

        const removeEvent = (
            <div>
                <Link to='/mngevents'>
                    <img
                        className='activities-icons'
                        src='../images/delete.png'
                        alt='מחיקה'
                        onClick={() => {
                            delEvent(event.uid);
                            handlePopup();
                        }}
                    />
                </Link>
            </div>
        );

        return createData(
            event.event_name,
            new Date(event.event_date.seconds * 1000).toLocaleDateString(),
            hours,
            event.type,
            event.name,
            activeImage,
            details,
            removeEvent
        );
    });

    {
        if (loading === true) return <Spinner />;
    }

    return (
        <>
            <div>
                <ThemeProvider theme={theme}>
                    <div className='box--sub container'>
                        <TableCostumized
                            rows={rows}
                            columns={columns}
                            rowsPerPage={10}
                            color='#FFA1A1'
                        />
                        <br />
                        <Export type='events' />
                    </div>
                </ThemeProvider>
            </div>
            <Popup
                showPopup={showPopup}
                handlePopup={handlePopup}
                title={popupTitle}
                noButton={popupButtonToggle}
                buttonText='שמירה'
                html={<div dangerouslySetInnerHTML={{ __html: popupHTML }} />}
            />
        </>
    );
};

export default EventsTable;
