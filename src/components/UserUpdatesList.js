import { useEffect, useState } from 'react';
import UserUpdate from './UserUpdate';
import { db } from "./Firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

function UserUpdatesList() {

    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        const getUpdates = async () => {
            const data = await getDocs(query(collection(db, "updates"), orderBy('created')));
            setUpdates(data.docs.map((doc) => ({ ...doc.data(), uid: doc.ref })));
        }
        getUpdates();
    }, []);

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
                    />
                )
            })}
        </div>
    )
}

export default UserUpdatesList;