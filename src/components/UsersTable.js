import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { heIL } from '@material-ui/core/locale';
import TableCostumized from './TableCostumized';
import yes from '../assets/yes.png';
import no from '../assets/no.png';
import { useState, useEffect } from 'react';
import { db } from './Firebase';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const UsersTable = (props) => {
    const [users, setUsers] = useState([]);
    const currUser = getAuth();

    // const editUser = (uid) => {
    //     console.log(uid);
    // };

    const deActive = (uid) => {
        // Update also in users collection
        getDocs(collection(db, 'users')).then((data) => {
            data.forEach((doc) => {
                if (doc.data().uid === uid) {
                    let active, errOccurred;
                    doc.data().isActive ? (active = false) : (active = true);
                    updateDoc(doc.ref, { isActive: active })
                        .catch((e) => {
                            errOccurred = true;
                            alert('אירעה שגיאה, נסה שנית');
                        })
                        .finally(() => {
                            if (!errOccurred) window.location.reload();
                        });
                }
            });
        });
    };

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(collection(db, 'users'));
            setUsers(data.docs.map((doc) => ({ ...doc.data() })));
        };
        getUsers();
    }, []);

    const theme = createTheme({}, heIL);

    const columns = [
        {
            id: 'firstName',
            label: 'שם פרטי',
            minWidth: 50,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'lastName',
            label: 'שם משפחה',
            minWidth: 50,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'city',
            label: 'עיר',
            minWidth: 90,
            align: 'center',
            format: (value) => value.toLocaleString('en-IL'),
        },
        {
            id: 'mail',
            label: 'מייל',
            minWidth: 150,
            align: 'center',
        },
        {
            id: 'gender',
            label: 'מין',
            minWidth: 50,
            align: 'center',
            format: (value) => value.toLocaleString('he-IL'),
        },
        {
            id: 'phone',
            label: 'טלפון',
            minWidth: 100,
            align: 'center',
        },
        {
            id: 'status',
            label: 'מצב',
            minWidth: 10,
            align: 'center',
        },
        {
            id: 'isAdmin',
            label: 'הרשאות מנהל',
            minWidth: 10,
            align: 'center',
        },
        {
            id: 'activities',
            label: 'פעולות',
            minWidth: 120,
            align: 'center',
        },
    ];

    function createData(
        firstName,
        lastName,
        city,
        mail,
        gender,
        phone,
        ssn,
        status,
        isAdmin,
        activities
    ) {
        return {
            firstName,
            lastName,
            city,
            mail,
            gender,
            phone,
            ssn,
            status,
            isAdmin,
            activities,
        };
    }

    const searchRes = users.filter((user) => {
        const searchWord = props.search;
        if (searchWord.length < 2) return true;
        return (
            user.city.includes(searchWord) ||
            (user.firstName + ' ' + user.lastName).includes(searchWord) ||
            user.email.includes(searchWord) ||
            user.tel.includes(searchWord)
        );
    });

    const filterRes = searchRes.filter((user) => {
        const filter = props.filter;

        if (filter === 'all') return true;
        else if (filter === 'active') return user.isActive;
        else if (filter === 'nonactive') return !user.isActive;

        if (filter === 'admins') return user.isAdmin;
    });

    const rows = filterRes.map((user) => {
        let active, admin, toggle;
        user.isActive ? (active = yes) : (active = no);
        user.isAdmin ? (admin = yes) : (admin = no);
        user.isActive ? (toggle = 'השבת') : (toggle = 'הפעל');

        const activeImage = (
            <img className='vx-image' src={active} alt='פעיל' />
        );
        const isAdminImage = (
            <img className='vx-image' src={admin} alt='פעיל' />
        );

        const isCurrentUser = currUser.currentUser.uid === user.uid

        const activities = (
            <div>
                <button
                    className={
                        user.isActive
                            ? 'form__btn btn--accent'
                            : 'form__btn btn--check'
                    }
                    id='activate-btn'
                    onClick={() => deActive(user.uid)}
                    disabled={isCurrentUser ? true : false}
                    style={isCurrentUser ? { opacity: 0.5, cursor: 'not-allowed' } : null}
                >
                    {toggle}
                </button>
            </div>
        );

        const emailLink = (
            <a href={`mailto:${user.email}`}>{user.email}</a>
        )
        return createData(
            user.firstName,
            user.lastName,
            user.city,
            emailLink,
            user.gender,
            user.tel,
            user.ssn,
            activeImage,
            isAdminImage,
            activities
        );
    });

    return (
        <ThemeProvider theme={theme}>
            <div className='box--sub container--big'>
                <TableCostumized
                    rows={rows}
                    columns={columns}
                    rowsPerPage={10}
                    color='#FFD59E'
                />
            </div>
        </ThemeProvider>
    );
};

export default UsersTable;
