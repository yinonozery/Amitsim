import { MdReadMore } from "react-icons/md"

const Call = (props) => {

    const callTypes = {
        "תיקון קל": "light-fix",
        "תיקון מורכב": "complex-fix",
        "חוות דעת": "opinion",
        "עצה מקצועית": "prof-advice",
        "טיפול ריגשי": "emotional-treatment",
        "ליווי מול רשויות": "authorities"
    }

    return (
        <div>
            <li className="calls-menu__item">
                <div className="container flexed">
                    <div className="calls-menu__item__details">
                        <div className="calls-menu__item__details__upper flexed">
                            <div className="details-top-right flexed">
                                <h4>{props.title}</h4>
                                <div className={`calls-menu__item__avatar avatar--${callTypes[props.type]}`}>{props.type}</div>
                            </div>
                            <small className="date small">{props.date}</small>
                        </div>
                        <div className="calls-menu__item__details__lower flexed">
                            <p className="calls-menu__item__details__description">{props.address}</p>
                            <button className="call-linker" onClick={() => props.handlePopup(props.title, props.type, props.description)}>לפרטים <MdReadMore className="read-more-icon" /></button>
                        </div>
                    </div>
                </div>
            </li>

        </div>
    )
}

export default Call;