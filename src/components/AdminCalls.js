import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import Header from "./Header";
import AdminPer from "./AdminPer";
import CallsTable from "./CallsTable";
import Export from "./Export"

const AdminCalls = () => {
    const [search, setSearch] = useState('');
    return (
        <div>
            <Header currPage="calls" />
            <AdminPer url="/mngcalls" />
            <br />
            <div className="box container">
                <h1 className="delivery-list__title title container">קריאות</h1>
                <br />
                <div className="calls-menu__search container">
                    <input type="text" className="calls-menu__search__input" placeholder="חפש קריאה" onChange={(e) => setSearch(e.target.value)} />
                    <FaSearch />
                </div>
                <CallsTable search={search} />
                <Export type="calls" />
            </div>
        </div>
    )
}

export default AdminCalls;