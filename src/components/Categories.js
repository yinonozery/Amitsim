import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./Firebase";

const Categories = () => {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const getRoles = async () => {
            setCats([]);
            const data = await getDocs(collection(db, 'roles'));
            data.forEach((e) => {
                const subarr = Object.values(e.data());
                setCats(cats => [...cats, subarr]);
            });
        }
        getRoles();
    }, []);
}

export default Categories;