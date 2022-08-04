import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { heIL } from "@material-ui/core/locale";
import TableCostumized from "./TableCostumized";
import { Link } from "react-router-dom";
import yes from "../assets/yes.png";
import no from "../assets/no.png";
import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { collection, getDocs, updateDoc } from "firebase/firestore";

const UsersTable = (props) => {
  const [users, setUsers] = useState([]);

  const editUser = (uid) => {
    console.log(uid);
  };

  const deActive = (uid) => {
    // Update also in users collection
    getDocs(collection(db, "users")).then((data) => {
      data.forEach((doc) => {
        if (doc.data().uid === uid) {
          let active, errOccurred;
          doc.data().isActive ? (active = false) : (active = true);
          updateDoc(doc.ref, { isActive: active })
            .catch((e) => {
              errOccurred = true;
              alert("אירעה שגיאה, נסה שנית");
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
      const data = await getDocs(collection(db, "users"));
      setUsers(data.docs.map((doc) => ({ ...doc.data() })));
    };
    getUsers();
  }, []);

  const theme = createTheme({}, heIL);

  const columns = [
    {
      id: "name",
      label: "שם",
      minWidth: 120,
      align: "center",
      format: (value) => value.toLocaleString("en-IL"),
    },
    {
      id: "city",
      label: "עיר",
      minWidth: 120,
      align: "center",
      format: (value) => value.toLocaleString("en-IL"),
    },
    {
      id: "mail",
      label: "מייל",
      minWidth: 120,
      align: "center",
    },
    {
      id: "gender",
      label: "מין",
      minWidth: 120,
      align: "center",
      format: (value) => value.toLocaleString("he-IL"),
    },
    {
      id: "phone",
      label: "טלפון",
      minWidth: 120,
      align: "center",
    },
    {
      id: "ssn",
      label: 'ת"ז',
      minWidth: 120,
      align: "center",
    },
    {
      id: "status",
      label: "מצב",
      minWidth: 120,
      align: "center",
    },
    {
      id: "isAdmin",
      label: "הרשאות מנהל",
      minWidth: 120,
      align: "center",
    },
    {
      id: "activities",
      label: "פעולות",
      minWidth: 120,
      align: "center",
    },
  ];

  function createData(
    name,
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
      name,
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
      user.name.includes(searchWord) ||
      user.email.includes(searchWord) ||
      user.tel.includes(searchWord) ||
      user.ssn.includes(searchWord)
    );
  });

  const filterRes = searchRes.filter((user) => {
    const filter = props.filter;

    if (filter === "all") return true;
    else if (filter === "active") return user.isActive;
    else if (filter === "nonactive") return !user.isActive;

    if (filter === "admins") return user.isAdmin;
  });

  const rows = filterRes.map((user) => {
    let active, admin, toggle;
    user.isActive ? (active = yes) : (active = no);
    user.isAdmin ? (admin = yes) : (admin = no);
    user.isActive ? (toggle = "השבת") : (toggle = "הפעל");

    const activeImage = <img className="vx-image" src={active} alt="פעיל" />;
    const isAdminImage = <img className="vx-image" src={admin} alt="פעיל" />;
    const activities = (
      <div>
        <button
          className="form__btn btn--accent"
          onClick={() => deActive(user.uid)}
        >
          {toggle}
        </button>
      </div>
    );
    return createData(
      user.name,
      user.city,
      user.email,
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
      <div className="box--sub container">
        <TableCostumized
          rows={rows}
          columns={columns}
          rowsPerPage={10}
          color="#FFD59E"
        />
      </div>
    </ThemeProvider>
  );
};

export default UsersTable;
