import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { db } from "./Firebase";
import Call from './Call';
import Popup from "./Popup";

const CallsList = (props) => {
    const [calls, setCalls] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popUpContent, setPopupContent] = useState({
        title: "",
        type: "",
        description: ""
    })

    const callsCollectionRef = collection(db, "calls");

    const handlePopup = (title, type, description) => {
        popUpContent.title = title;
        popUpContent.type = type;
        popUpContent.description = description;
        setShowPopup(prevShowPopup => !prevShowPopup);
    }

    useEffect(() => {
        const getcalls = async () => {
            const data = await getDocs(query(callsCollectionRef, orderBy('call_date')));
            setCalls(data.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
        }
        getcalls();
    }, []);

    const searchRes = calls.filter((call) => {
        const searchWord = props.search;
        if (searchWord.length < 2)
            return true;
        return call.description.includes(props.search) ||
            call.call_name.includes(props.search) ||
            call.call_address.includes(props.search) ||
            call.call_type.includes(props.search)
            ;
    });

    const callsUI = searchRes.map((call) => {
        return (
            <div key={call.uid}>
                <Call
                    title={call.call_name}
                    type={call.call_type}
                    date={call.call_date.toDate().toLocaleDateString('he-IL')}
                    isActive={call.is_active}
                    roles={call.roles}
                    description={call.description}
                    address={call.call_address}
                    handlePopup={handlePopup}
                />
            </div>
        );
    })
    return (
        <div>
            <Popup
                showPopup={showPopup}
                handlePopup={handlePopup}
                title={popUpContent.title}
                type={popUpContent.type}
                description={popUpContent.description}
            />
            <ul className="calls-menu">
                {callsUI}
            </ul>
        </div>
    )
}

export default CallsList;