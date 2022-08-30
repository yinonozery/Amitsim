import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import Header from "./Header";
import AdminPer from "./AdminPer";
import EventsTable from "./EventsTable";

const AdminEvents = () => {
    const [search, setSearch] = useState('');
    return (
        <div>
            <Header currPage="events" />
            <AdminPer url="/mngevents" />
            <br />
            <div className="box container">
                <h1 className="event-list__title title container">אירועים</h1>
                <br />
                <div className="calls-menu__search container">
                    <input type="text" className="calls-menu__search__input" placeholder="חפש אירוע" onChange={(e) => setSearch(e.target.value)} />
                    <FaSearch />
                </div>
                <EventsTable search={search} />
            </div>
        </div>
    );
}

export default AdminEvents; 