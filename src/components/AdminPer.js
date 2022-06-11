import { getAuth } from "firebase/auth";
import { db, logout } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const AdminPer = (props) => {
    const navigate = useNavigate();
    const user = getAuth();
    let isAdmin = false;
    let url = "";
    if (props)
        url = props.url;

    useEffect(() => {
        onAuthStateChanged(user, (user) => {
            if (user) {
                getDocs(collection(db, "users")).then((data) => {
                    data.forEach((doc) => {
                        if (!isAdmin && user && user.uid === doc.data().uid && doc.data().isAdmin && doc.data().isActive) {
                            //console.log('Logged in as administrator (', doc.data().name, ')');
                            isAdmin = true;
                            navigate(url);
                        }
                        else if (user && user.uid === doc.data().uid && !doc.data().isActive) {
                            logout(user);
                            alert("You are not authorized anymore to access this application.");
                            navigate('/');
                            return;
                        }
                    });
                    if (user && isAdmin === false)
                        navigate('/userdash');
                });
            } else {
                navigate('/');
            }
        });
    }, []);

    return null;
};

export default AdminPer;