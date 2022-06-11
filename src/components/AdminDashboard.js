import AdminPer from "./AdminPer"
import Header from "./Header"
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import CallsList from "./CallsList";
import UserUpdatesList from "./UserUpdatesList";
import "./layout/dashboard.css";

const AdminDashboard = () => {
    return (
        <div>
            <Header currPage="home" />
            <AdminPer url="/dashboard" />
            <div className="container row">
                <div className="statistic box box--sub">
                    <section className="statistic__packages container">
                        <h2 className="section__title">משלוחים</h2>
                        <div className="section__row spaced">
                            <div className="statistic__packages__categories col">
                                <p>משלוחים לטיפול:</p>
                                <p>משלוחים בטיפול:</p>
                                <p>משלוחים שטופלו:</p>
                            </div>
                            {/*we can do a calculation here to decide the % value from the data we have*/}
                            <CircularProgressWithLabel value={89} />
                        </div>
                    </section>
                </div>
                <div className="statistic box box--sub">
                    <section className="statistic__calls container">
                        <h2 className="section__title">קריאות</h2>
                        <div className="section__row spaced">
                            <div className="statistic__calls__categories col">
                                <p>קריאות לטיפול: 10</p>
                                <p>קריאות בטיפול: 5</p>
                                <p>קריאות שטופלו: 5</p>
                            </div>
                            {/*we can do a calculation here to decide the % value from the data we have*/}
                            <CircularProgressWithLabel value={50} />
                        </div>
                    </section>
                </div>
            </div>

            <div className="box container">
                <section className="user-updates container">
                    <h2 className="section__title">עדכונים </h2>
                    <UserUpdatesList />
                </section>
            </div>
        </div>
    )
};

export default AdminDashboard;