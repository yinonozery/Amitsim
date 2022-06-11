import "./layout/userUpdates.css";
import Header from "./Header";
import UserUpdatesList from "./UserUpdatesList";

const UsersUpdates = () => {
    return (
        <div>
            <Header currPage="updates" />
            <div className="box box--sub container">
                <div className="container">
                    <div className="updates__title title">עדכונים</div>
                    <UserUpdatesList />
                </div>
            </div>
        </div>
    )
}

export default UsersUpdates;