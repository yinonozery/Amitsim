import React from 'react'
import Header from "./Header";
import AdminPer from "./AdminPer"
import FamiliesTable from './FamiliesTable';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Families = () => {
    const [search, setSearch] = useState('');
    return (
        <div>
            <Header currPage="users" />
            <AdminPer url="/families" />
            <br />
            <div className="box container">
                <h1 className="delivery-list__title title container">רשימת מוטבים</h1>
            </div>
            <br />
            <div className="box container">
                <div className="calls-menu__search container">
                    <input type="text" className="calls-menu__search__input" placeholder="חפש מוטב" onChange={(e) => setSearch(e.target.value)} />
                    <FaSearch />
                </div>
                <FamiliesTable search={search} />
            </div>

        </div>
    )
}

export default Families;