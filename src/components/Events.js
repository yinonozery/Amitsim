import React from 'react';
import Header from './Header';
import EventsList from './EventsList';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const Events = () => {
    const [search, setSearch] = useState('');
    return (
        <div>
            <Header currPage="events" />
            <br />
            <div className="box container">
                <h1 className="event-list__title title container">אירועים</h1>
            </div><br /><div className="box container">
                <div className="calls-menu__search container">
                    <input type="text" className="calls-menu__search__input" placeholder="חפש אירוע" onChange={(e) => setSearch(e.target.value)} />
                    <FaSearch />
                </div>
                <EventsList search={search} />
            </div>
        </div>
    )
}

export default Events;