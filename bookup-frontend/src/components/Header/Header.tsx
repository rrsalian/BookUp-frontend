import { useContext, useState } from "react"
import bookUserPhoto from "../../images/5738803.png"
import bookUpLogo from "../../images/guilded_image_ca1df0acf51f97f657574c81c890a1e5.png"
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { signOut } from "../../firebaseConfig";
import "./Header.css"

export function Header() {

    const { user } = useContext(AuthContext);
    const [dropdown, setDropDown] = useState(false)
    const toggleDropDown = () => dropdown ? setDropDown(false) : setDropDown(true)


    return (
        <div>
            <header className="header">
                <nav className="navbar">
                    <div>
                        <img src={bookUpLogo} className="logo"></img>
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div className="user-profile">
                        {!!user?.photoURL && <button><img onClick={toggleDropDown} className="user-photo" src={!user.photoURL ? bookUserPhoto : user.photoURL} alt="" width="40px" /></button>}
                    </div>
                    <div className={dropdown ? "dropdown" : "hidden"}>
                        <p> {user?.displayName} </p>
                        <ul>
                            <li className="navHover"><Link to="/">Home</Link></li>
                            <li className="navHover"><Link to="/mybooks">My Books</Link></li>
                            <li className="navHover"><Link to="/mychathistory">My Chat</Link></li>
                            <button className="navHover" onClick={signOut}>Sign Out</button>
                        </ul>
                    </div>

                </nav>
            </header>
        </div>
    )
}