import React from 'react';
import { createTheme, ThemeProvider } from "@material-ui/core";
import { heIL } from '@material-ui/core/locale'
import TableCostumized from "./TableCostumized";
import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";

const FamiliesTable = (props) => {
    const [families, setFamilies] = useState([]);

    useEffect(() => {
        const getFamilies = async () => {
            const data = await getDocs(collection(db, 'Families'));
            setFamilies(data.docs.map((doc) => ({ ...doc.data() })))
        }
        getFamilies();
    }, []);

    const theme = createTheme({}, heIL);

    const columns = [
        {
            id: 'name',
            label: 'שם',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'birth',
            label: 'תאריך לידה',
            minWidth: 120,
            align: 'center',
        },
        {
            id: 'mail',
            label: 'מייל',
            minWidth: 120,
            align: 'center'
        },
        {
            id: 'phone',
            label: 'טלפון',
            minWidth: 120,
            align: 'center'
        },
        {
            id: 'address',
            label: 'כתובת',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'notes',
            label: 'הערות',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'city',
            label: 'עיר',
            minWidth: 120,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'minors',
            label: 'כמות ילדים מתחת לגיל 16',
            minWidth: 120,
            align: 'center',
        }
    ];

    function createData(name, birth ,mail, phone, address, notes ,city, minors) {
        return { name, birth ,mail, phone, address, notes ,city, minors };
    }

    const searchRes = families.filter((fam) => {
        const searchWord = props.search;
        if (searchWord.length < 2)
            return true;
        return fam.address.includes(props.search) ||
            fam.city.includes(props.search) ||
            fam.fname.includes(props.search) ||
            fam.lname.includes(props.search) ||
            fam.phone.includes(props.search)
            ;
    });

    const rows = searchRes.map((family) => {
        const fullName = `${family.fname} ${family.lname}`
        const minors = family.minors > 0 ? family.minors : "אין" 
        const notes = family.notes && /[\u0590-\u05FF]/.test(family.notes) ? family.notes : "אין" 
        return createData(fullName, family.birth ,family.email, family.phone, family.address, notes ,family.city, minors);
    })

    return (
        <ThemeProvider theme={theme}>
            <div className="box--sub container--big">
                <TableCostumized
                    rows={rows}
                    columns={columns}
                    rowsPerPage={10}
                    color='#FFBDE6'
                />
            </div>
        </ThemeProvider >
    )
}

export default FamiliesTable