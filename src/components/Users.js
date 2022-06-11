import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import Header from "./Header";
import AdminPer from "./AdminPer"
import UsersTable from './UsersTable';
import Export from "./Export"

const Users = () => {
    const [search, setSearch] = useState('');

    return (
        <div>
            <Header currPage="users" />
            <AdminPer url="/users" />
            <br />
            <div className="box container">
                <h1 className="delivery-list__title title container">רשימת מתנדבים</h1>
            </div><br /><div className="box container">
                <div className="calls-menu__search container">
                    <input type="text" className="calls-menu__search__input" placeholder="חפש מתנדב" onChange={(e) => setSearch(e.target.value)} />
                    <FaSearch />
                </div>
                <UsersTable search={search} />
                <Export type="users" />
            </div>
        </div>
    )
}

export default Users;
