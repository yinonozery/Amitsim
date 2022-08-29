import { getDocs, collection } from "firebase/firestore";
import { db } from "./Firebase";

const exportUsers = () => {

    const getUsers = async () => {
        const data = await getDocs(collection(db, 'users'));
        return (data.docs.map((doc) => ({ ...(doc.data()) })))
    }

    const createFile = async () => {
        const arr = await getUsers();
        //define the heading for each row of the data  
        var csv = 'שם פרטי, שם משפחה, תעודת זהות, אימייל, פלאפון, מגדר, פעיל, מנהל,מזהה משתמש\n';
        //merge the data with CSV  

        Object.entries(arr).forEach((row) => {
            const user = row[1];
            csv += user.firstName + ',' + user.lastName + ',' + user.ssn + ',' + user.email + ',' + user.tel + ','
                + user.gender + ',' + user.isActive + ',' + user.isAdmin + ',' + user.uid;
            csv += "\n";
        });

        //display the created CSV data on the web browser   
        document.write(csv);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `Amitsim-Users-${new Date().toISOString()}.csv`;
        hiddenElement.click();
        window.location.href = "/users"
    }

    return (
        <div className="exportBtn">
            <button className="btn--accent" onClick={() => createFile()}>ייצוא משתמשים לאקסל</button>
        </div>
    )
}

const exportEvents = () => {

    const getEvents = async () => {
        const data = await getDocs(collection(db, 'events'));
        return (data.docs.map((doc) => ({ ...(doc.data()) })))
    }

    const createFile = async () => {
        const arr = await getEvents();
        //define the heading for each row of the data  
        var csv = 'תאריך, שם האירוע, סוג, מיקום, תיאור, פעיל, יוצר האירוע, תאריך יצירה\n';
        //merge the data with CSV  

        Object.entries(arr).forEach((row) => {
            const event = row[1];
            csv += new Date(event.event_date.seconds * 1000).toLocaleDateString() + ',' + event.event_name + ',' + event.type + ',' + event.location + ','
                + event.description + ',' + event.is_active + ',' + event.name + ',' + new Date(event.created.seconds * 1000).toLocaleDateString();
            csv += "\n";
        });

        //display the created CSV data on the web browser   
        document.write(csv);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `Amitsim-Events-${new Date().toISOString()}.csv`;
        hiddenElement.click();
        window.location.href = "/mngevents";
    }

    return (
        <div className="exportBtn">
            <button className="btn--accent" onClick={() => createFile()}>ייצוא אירועים לאקסל</button>
        </div>
    )
}

const exportCalls = () => {

    const getCalls = async () => {
        const data = await getDocs(collection(db, 'calls'));
        return (data.docs.map((doc) => ({ ...(doc.data()) })))
    }

    const createFile = async () => {
        const arr = await getCalls();
        //define the heading for each row of the data  
        var csv = 'תאריך, שם הקריאה, סוג, כתובת, תיאור, פעיל, תאריך יצירה\n';
        //merge the data with CSV  

        Object.entries(arr).forEach((row) => {
            const call = row[1];
            csv += new Date(call.call_date.seconds * 1000).toLocaleDateString() + ',' + call.call_name + ',' + call.call_type + ',' + call.call_address + ','
                + call.description + ',' + call.is_active + ',' + new Date(call.created.seconds * 1000).toLocaleDateString();
            csv += "\n";
        });

        //display the created CSV data on the web browser   
        document.write(csv);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `Amitsim--${new Date().toISOString()}.csv`;
        hiddenElement.click();
        window.location.href = "/mngcalls";
    }

    return (
        <div className="exportBtn">
            <button className="btn--accent" onClick={() => createFile()}>ייצוא קריאות לאקסל</button>
        </div>
    )
}
const Export = (props) => {
    if (props.type === 'users')
        return exportUsers();
    else if (props.type === 'events')
        return exportEvents();
    else if (props.type === 'calls')
        return exportCalls();
}

export default Export;