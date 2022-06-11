import Header from './Header';
import CallsList from './CallsList';
import './layout/calls.css';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Calls = () => {
    const [search, setSearch] = useState('');
    return (
        <div>
            <Header currPage="calls" />
            <br />
            <main className="main">
                <div className="box box--sub container">
                    <h1 className="calls-menu__title title">קריאות</h1>
                    <div className="calls-menu__search container">
                        <input type="text" className="calls-menu__search__input" placeholder="חפש קריאה" onChange={(e) => setSearch(e.target.value)} />
                        <FaSearch />
                    </div>
                    <div className="container">
                        <CallsList search={search} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Calls;