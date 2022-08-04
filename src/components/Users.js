import { FaSearch, FaFilter } from "react-icons/fa";
import { useState, useRef } from "react";
import Header from "./Header";
import AdminPer from "./AdminPer";
import UsersTable from "./UsersTable";
import Export from "./Export";

const Users = () => {
  const [search, setSearch] = useState("");
  const filterActive = useRef("");
  const filterNonActive = useRef("");
  const filterAdmins = useRef("");

  const [filter, setFilter] = useState("all");

  const handleFilter = () => {
    if (filterActive.current.checked && filterNonActive.current.checked)
      setFilter("all");
    else if (filterActive.current.checked && !filterNonActive.current.checked)
      setFilter("active");
    else if (!filterActive.current.checked && filterNonActive.current.checked)
      setFilter("nonactive");
    if (filterAdmins.current.checked) {
        setFilter("admins");
        filterActive.current.checked = false;
        filterNonActive.current.checked = false;
    }
  };

  return (
    <div>
      <Header currPage="users" />
      <AdminPer url="/users" />
      <br />
      <div className="box container">
        <h1 className="delivery-list__title title container">רשימת מתנדבים</h1>
      </div>
      <br />
      <div className="box container">
        <div className="calls-menu__search container">
          <input
            type="text"
            className="calls-menu__search__input"
            placeholder="חפש מתנדב"
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch />
        </div>
        <p className="bold">
          <FaFilter /> סינון משתמשים
        </p>
        <p>
          <input
            id="active"
            type="checkbox"
            ref={filterActive}
            onChange={() => handleFilter()}
            defaultChecked
          />
          <label htmlFor="active">פעילים</label>
        </p>
        <p>
          <input
            id="nonactive"
            type="checkbox"
            ref={filterNonActive}
            onChange={() => handleFilter()}
            defaultChecked
          />
          <label htmlFor="nonactive">לא פעילים</label>
        </p>
        <p>
          <input
            id="admins"
            type="checkbox"
            ref={filterAdmins}
            onChange={() => handleFilter()}
          />
          <label htmlFor="admins">מנהלים בלבד</label>
        </p>
        <UsersTable search={search} filter={filter} />
        <Export type="users" />
      </div>
    </div>
  );
};

export default Users;
