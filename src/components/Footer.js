import { MdOutlineVolunteerActivism } from "react-icons/md";
import { SiGithub } from "react-icons/si";

const Footer = () => {
    return (
        <div className="copyrights">
            <MdOutlineVolunteerActivism />&nbsp;
            האתר הוקם בהתנדבות ובאהבה עבור ארגון אמיצים
            &nbsp;<MdOutlineVolunteerActivism />
            <br />
            <a href="https://github.com/yinonozery/amitsim" target="_blank"><SiGithub /></a>
        </div>
    )
}

export default Footer;