import Header from "./Header"
import CloseEvents from './CloseEvents';
import UserUpdatesList from "./UserUpdatesList";
import SignedUpEvents from "./SignedUpEvents";
import CallsList from "./CallsList";
import { getAuth } from "firebase/auth";
import { GrAnnounce, GrDeliver, GrConfigure } from "react-icons/gr";
import "./layout/dashboard.css";
import "./layout/notifications.css";

const UserDashboard = () => {
    const user = getAuth();
    return (
        <div>
            <Header currPage="home" />
            <div className="container row">
                <div className="container box box--sub">
                    <h2>אירועים קרובים בשבילך</h2>
                    <CloseEvents user={user} />
                </div>
                <div className="container box box--sub">
                    <h2>אירועים שנרשמת אליהם</h2>
                    <SignedUpEvents user={user} />
                </div>
            </div>
            <section className="status-tables">
                <div className="container box box--sub">
                    <div className="status-tables--group status-table__notifications">
                        <GrAnnounce size="20" />
                        <h3 className="container">עדכונים </h3>
                        <UserUpdatesList />
                        <div className="status-tables__linker">
                            <a href="/updates"><small>הראה הכל</small></a>
                        </div>
                    </div>
                </div>
                <div className="container box box--sub">
                    <div className="status-tables--group status-table__packages">
                        <GrDeliver size="20" />
                        <h3 className="container">משלוחים</h3>
                        <div className="status-tables__linker">
                            <a href="#"><small>הראה הכל</small></a>
                        </div>
                    </div>
                </div>
                <div className="container box box--sub">
                    <div className="status-tables--group status-table__packages">
                        <GrConfigure size="20" />

                        <h3 className="container">קריאות</h3>
                        <section className="calls container">
                            <CallsList search="" />
                        </section>
                    </div>
                    <div className="status-tables__linker">
                        <a href="calls"><small>הראה הכל</small></a>
                    </div>
                </div>
            </section >
        </div >
    )
};

export default UserDashboard;