import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./Firebase";
import Popup from './Popup';
import Event from './Event';


const EventsList = (props) => {

    const [events, setEvents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popUpContent, setPopupContent] = useState({
        title: "",
        type: "",
        description: ""
    })

    const handlePopup = (title, type, description) => {
        popUpContent.title = title;
        popUpContent.type = type;
        popUpContent.description = description;
        setShowPopup(prevShowPopup => !prevShowPopup);
    }

    const eventsCollectionRef = collection(db, "events");

    useEffect(() => {
        const getEvents = async () => {
            const data = await getDocs(query(eventsCollectionRef, orderBy('event_date')));
            setEvents(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getEvents();
    }, []);

    const searchRes = events.filter((event) => {
        const searchWord = props.search;
        if (searchWord.length < 2)
            return true;
        return event.description.includes(props.search) ||
            event.event_name.includes(props.search) ||
            event.location.includes(props.search)
            ;
    });

    const eventsUI = searchRes.map((event) => {
        return (
            <div key={event.uid}>
                <Event
                    title={event.event_name}
                    type={event.type}
                    date={event.event_date.toDate().toLocaleDateString('he-IL')}
                    address={event.location}
                    description={event.description}
                    handlePopup={handlePopup}
                />
            </div>
        );
    })


    return (
        <div>
            <Popup
                showPopup={showPopup}
                handlePopup={handlePopup}
                title={popUpContent.title}
                type={popUpContent.type}
                description={popUpContent.description}
            />
            <ul className="events-menu">
                {eventsUI}
            </ul>
        </div>
    )
}

export default EventsList;