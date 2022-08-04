import { db, auth } from "./Firebase";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { useRef, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaRegCalendarPlus } from "react-icons/fa";
import AdminPer from "./AdminPer";
import Header from "./Header";
import "./layout/newEvent.css";

const NewEvent = () => {
  const title = useRef("");
  const description = useRef("");
  const date = useRef("");
  const location = useRef("");
  const [cats, setCats] = useState([]);
  const [type, setType] = useState("");
  const [user] = useAuthState(auth);
  const [eventStringsRoles, setEventStringsRoles] = useState([]);
  const [catTitles, setCatTitles] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      setCats([]);
      const data = await getDocs(collection(db, "roles"));
      data.forEach((e) => {
        const subarr = Object.values(e.data());
        setCatTitles((catTitles) => [...catTitles, e.id]);
        setCats((cats) => [...cats, subarr]);
      });
    };
    getRoles();
  }, []);

  const chooseAmount = (role) => {
    let amount;

    if (role.target.checked === true)
      amount = prompt(
        "נבחר תפקיד " +
          cats[role.target.id.charAt(0)][role.target.value] +
          ". הכנס כמות נדרשת:"
      );
    else {
      setEventStringsRoles((eventStringsRoles) =>
        eventStringsRoles.filter((roleInList) => {
          const arr = roleInList.split("-");
          const roleStr = arr[0] + "-" + arr[1];
          return roleStr !== role.target.id;
        })
      );
      return;
    }
    if (amount <= 0) {
      alert("לפחות 1");
      role.target.checked = false;
      return;
    }

    setEventStringsRoles((eventStringsRoles) => [
      ...eventStringsRoles,
      role.target.id + "-" + amount,
    ]);
  };

  const showCats = (index) => {
    const div1 = document.createElement("div");
    div1.key = index;
    div1.id = "titleCat";

    const h3 = document.createElement("h3");
    h3.innerHTML = catTitles[index];
    div1.appendChild(h3);
    document.getElementById("showCats").replaceChildren(div1);

    cats[index].forEach((role, indexRole) => {
      const div = document.createElement("div", { key: indexRole });
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", index + "-" + indexRole);
      input.onchange = (e) => chooseAmount(e);
      input.value = indexRole;

      const label = document.createElement("label");
      label.setAttribute("for", index + "-" + indexRole);
      label.textContent = role;
      div.appendChild(input);
      div.appendChild(label);

      document.getElementById("titleCat").appendChild(div);
    });

    eventStringsRoles.forEach((role) => {
      const nums = role.split("-");
      if (document.getElementById(nums[0] + "-" + nums[1]))
        document.getElementById(nums[0] + "-" + nums[1]).checked = true;
    });
  };

  const addEvent = async (e) => {
    e.preventDefault();
    let usersSigned = {};
    eventStringsRoles.forEach((str) => {
      const str2 = str.split("-");
      const str3 = str2[0] + "-" + str2[1];
      usersSigned[str3] = [];
    });

    try {
      await addDoc(collection(db, "events"), {
        name: user.displayName,
        event_name: title.current.value,
        event_date: Timestamp.fromDate(new Date(date.current.value)),
        location: location.current.value,
        type: type,
        description: description.current.value,
        is_active: true,
        roles: eventStringsRoles,
        users: usersSigned,
        created: Timestamp.now(),
      });
    } catch (err) {
      alert(err);
    }
  };

  window.onload = () => {
    // Set min and max dates
    const today = new Date().toISOString().split("T")[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementsByName("date")[0].setAttribute("min", today);
    document
      .getElementsByName("date")[0]
      .setAttribute("max", nextYear.toISOString().split("T")[0]);
  };

  return (
    <div>
      <Header currPage="events" />
      <AdminPer url="/newevent" />
      <br />
      <div className="box container">
        <h1 className="event-details__title title container">
          הוספת אירוע חדש
        </h1>
      </div>
      <div className="container row">
        <div className="event-details box box--sub col">
          <div className="container">
            <h2 className="event-details__form-title">פרטי אירוע</h2>

            <form onSubmit={addEvent}>
              <div className="form__group">
                <span className="label">כותרת : </span>
                <input
                  className="form__input form__input--labled"
                  ref={title}
                  type="text"
                  name="title"
                  required
                />
              </div>

              <div className="form__group">
                <span className="label">תאריך: </span>
                <input
                  className="form__input form__input--labled"
                  ref={date}
                  type="date"
                  name="date"
                  required
                />
              </div>

              <div className="form__group">
                <span className="label">מיקום: </span>
                <input
                  className="form__input form__input--labled"
                  ref={location}
                  type="text"
                  required
                />
              </div>

              <div className="form__group">
                <span className="label">סוג אירוע: </span>
                <select
                  className="form__input"
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="חבילות אור - חנוכה">חבילות אור - חנוכה</option>
                  <option value="מפגש שבועי איזורי">מפגש שבועי איזורי</option>
                  <option value="קבוצות תמיכה בזום">קבוצות תמיכה בזום</option>
                  <option value="קרנבל פורים">קרנבל פורים</option>
                  <option value="לל''י לכיתה א">לל''י לכיתה א</option>
                  <option value="הפנינג סוף הקיץ">הפנינג סוף הקיץ</option>
                </select>
              </div>

              <div className="form__group">
                <span className="label">פירוט: </span>
                <textarea
                  className="event-description form__input--labled"
                  ref={description}
                  id="desc"
                  rows="4"
                  cols="20"
                ></textarea>
              </div>

              <div className="form__group">
                <span className="label">בחר תפקידים: </span>
                <select
                  id="showCat"
                  className="form__input"
                  onChange={(e) => showCats(e.target.value)}
                >
                  <option defaultValue hidden>
                    בחר קטגוריה
                  </option>
                  {catTitles.map((title, index) => {
                    return (
                      <option value={index} key={index}>
                        {title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <p id="showCats"></p>

              <button className="edit-btn btn--accent" type="submit">
                <div className="spaced">
                  <p>הוספת אירוע</p>
                  <div className="btn__icon btn__icon--create-event">
                    <FaRegCalendarPlus />
                  </div>
                </div>
              </button>
            </form>
          </div>
        </div>

        <div className="event-details__roles box box--sub">
          <div className="container">
            <h2 className="event-details__form-title">סיכום תפקידים</h2>
            <ol className="event-details__roles__list">
              {eventStringsRoles.map((role) => {
                const nums = role.split("-");
                return (
                  <li key={role}>
                    {cats[nums[0]][nums[1]]}, כמות: {nums[2]}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvent;
