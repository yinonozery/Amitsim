import React from 'react';
import { MdReadMore } from "react-icons/md"
import './layout/events.css'

function Event(props) {

    const eventTypes = {
        "חבילות אור-חנוכה": "hanukkah",
        "מפגש שבועי איזורי": "meeting",
        "קבוצות תמיכה בזום": "support-groups",
        "קרנבל פורים": "purim",
        "ללי לכיתה א": "first-grade",
        "עסקים פילנטרופיים": "philanthropic",
        "הפנינג סוף קיץ": "happening"
    }

    return (
        <div>
            <li className="events-menu__item">
                <div className="container flexed">
                    <div className="events-menu__item__details">
                        <div className="events-menu__item__details__upper flexed">
                            <div className="details-top-right flexed">
                                <h4>{props.title}</h4>
                                <div className={`events-menu__item__avatar avatar--${eventTypes[props.type]}`}>{props.type}</div>
                            </div>
                            <small className="date small">{props.date}</small>
                        </div>
                        <div className="events-menu__item__details__lower flexed">
                            <p className="events-menu__item__details__description">{props.address}</p>
                            <button className="event-linker" onClick={() => props.handlePopup(props.title, props.type, props.description)}>לפרטים <MdReadMore className="read-more-icon" /></button>
                        </div>
                    </div>
                </div>
            </li>
        </div>
    )
}

export default Event;