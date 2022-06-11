import { db } from "./Firebase";
import { collection, query, doc, getDocs, getDoc, orderBy, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import "./layout/dashboard.css";
import "./layout/notifications.css";

const CloseEvents = (props) => {
    const [events, setEvents] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [categories, setCategories] = useState([]);
    const user = props.user;
    let refUser;

    useEffect(() => {
        const getEvents = async () => {
            const data = await getDocs(query(collection(db, "events"), orderBy('event_date')));
            setEvents(data.docs.map((doc) => ({ ...doc.data(), uid: doc.ref })));
        }
        getEvents();
        getRoles();
    }, []);

    const getRoles = async () => {
        getDocs(collection(db, "roles")).then((data) => {
            setCategories(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        });
    }

    const getUserRoles = async () => {
        const doc = await getDoc(refUser);
        setUserRoles(userRoles => userRoles = doc.data().roles);

    }

    useEffect(() => {
        onAuthStateChanged(user, () => {
            if (user.currentUser) {
                refUser = doc(db, "users", user.currentUser.uid);
                getUserRoles();
            }
        });
    }, [user]);

    const signUpForEvent = async (uid, newRoles, index) => {
        let roleArr = newRoles[index].split('-');
        roleArr[2] = parseInt(roleArr[2]) - 1;
        newRoles[index] = roleArr.join('-');
        let res;
        let updateFlag = false
        await getDoc(uid).then((e) => {
            const updateRole = roleArr[0] + '-' + roleArr[1];
            const cloneObj = Object.entries(e.data().users);
            cloneObj.forEach((r) => {
                if (r[0] === updateRole) {
                    if (!r[1].some((fc) => fc.id === user.currentUser.uid)) {
                        r[1].push(doc(db, "users", user.currentUser.uid));
                        updateFlag = true;
                    }
                }
            })
            res = Object.fromEntries(cloneObj);
        });
        if (updateFlag) {
            await updateDoc(uid, { roles: newRoles, users: res });
            window.location.reload();
        }
    }

    let addToList = false;
    let result = [];
    return (
        <div>
            {events.map((e, index) => { // Events
                addToList = false;
                result = [];

                e.roles.forEach((eventNeeds, index1, array) => { // Each role in event
                    const splitRoles = eventNeeds.split('-');
                    const cat = splitRoles[0];
                    const role = splitRoles[1];
                    const qtyNeeded = splitRoles[2];
                    if (!e.is_active || qtyNeeded <= 0) return;
                    if (userRoles.some((r) => r === eventNeeds.substring(0, 3))) {
                        if (!Object.entries(e.users).some((g1) => {
                            return g1[1].some((g2) => g2.id === user.currentUser.uid);
                        })) {
                            addToList = true;
                            result.push(<p key={index1}><button id="index" className="btn--check" onClick={() => signUpForEvent(e.uid, e.roles, index1)}>הירשם בתור {categories[cat][role]} [{qtyNeeded}]</button></p>)
                        }
                    }
                });
                if (addToList) {
                    return (
                        <div key={index}>
                            <div className="seperator"></div>
                            <h3>שם האירוע {e.event_name}</h3>
                            <h5>מתי? {e.event_date.toDate().toLocaleDateString('he-IL')}</h5>
                            {result}
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default CloseEvents;