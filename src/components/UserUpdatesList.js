import { useEffect, useState } from 'react';
import UserUpdate from './UserUpdate';
import { db } from "./Firebase";
import { collection, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function UserUpdatesList() {

    const [updates, setUpdates] = useState([]);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const user = getAuth();
    
    useEffect(() => {
        const getUpdates = async () => {
            const data = await getDocs(query(collection(db, "updates"), orderBy('created', 'desc')));
            setUpdates(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getUpdates();
    }, []);

    useEffect(() => {
        onAuthStateChanged(user, async () => {
            const refUser = doc(db, "users", user.currentUser.uid);
            const doc2 = await getDoc(refUser);
            if (doc2.data().isAdmin)
                setIsUserAdmin(true);
            else
                setIsUserAdmin(false);
        })
    }, [user]);

    return (
        <div>
            {updates.map((updates, index) => {
                return (
                    <UserUpdate
                        key={index}
                        author={updates.author}
                        title={updates.title}
                        msg={updates.msg}
                        date={updates.created.toDate().toLocaleDateString('he-IL')}
                        uid={updates.uid}
                        isUserAdmin={isUserAdmin}
                    />
                )
            })}
        </div>
    )
}

export default UserUpdatesList;