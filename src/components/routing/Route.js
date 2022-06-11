import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "../Login";
import AdminDashboard from "../AdminDashboard";
import Profile from "../Profile"
import NewEvent from "../NewEvent"
import Users from "../Users"
import Events from "../Events";
import Register from "../Register";
import Reset from "../Reset";
import UserDashboard from "../UserDashboard";
import NewCall from "../NewCall";
import Calls from "../Calls";
import NewUpdate from "../NewUpdate";
import UsersUpdates from "../UsersUpdates";
import AdminCalls from "../AdminCalls";
import AdminEvents from "../AdminEvents";
import Families from "../Families"

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Routing = () => {

    const user = getAuth();
    const [login, setLogin] = useState(false);

    useEffect(() => {
        onAuthStateChanged(user, async () => {
            if (getAuth().currentUser)
                setLogin(true);
            else
                setLogin(false)
        });
    }, [user, user.currentUser]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={login ? <AdminDashboard /> : <Login />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/newevent" element={<NewEvent />} />
                <Route path="/users" element={<Users />} />
                <Route path="/events" element={<Events />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userdash" element={<UserDashboard />} />
                <Route path="/newcall" element={<NewCall />} />
                <Route path="/calls" element={<Calls />} />
                <Route path="/newupdate" element={<NewUpdate />} />
                <Route path="/updates" element={<UsersUpdates />} />
                <Route path="/mngcalls" element={<AdminCalls />} />
                <Route path="/mngevents" element={<AdminEvents />} />
                <Route path="/families" element={<Families />} />
            </Routes>
        </Router>
    );
}

export default Routing;