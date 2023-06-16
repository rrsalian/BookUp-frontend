import { useContext, useState } from "react";
import { signInWithGoogle, signOut } from "../../firebaseConfig";
import AuthContext from "../../contexts/AuthContext";
import { BookFinder } from "../BookFinder/BookFinder";
import "./SignIn.css"
import bookUserPhoto from "../../images/5738803.png"


export function SignIn() {

    const { user } = useContext(AuthContext);

    const [dropdown, setDropDown] = useState(false)

    const toggleDropDown = () => dropdown ? setDropDown(false) : setDropDown(true)

    return (
        <div>


            <div>
                {user ?
                    <div>
                        <nav className="navbar">
                            <div>
                                <h1 className="logo">BookUp</h1>
                            </div>
                            <div>
                                
                            </div>
                            <div>
                                
                            </div>
                            <div className="user-profile">
                        { !!user?.photoURL && <button><img onClick={toggleDropDown} className="user-photo" src={!user.photoURL ? bookUserPhoto : user.photoURL} alt="" width="40px"/></button>}
                            <h2> {user.displayName} </h2>
                        </div>
                        
                        </nav>
                        <div className={dropdown ? "dropdown" : "hidden"}>
                        <ul>
                                    <li>My Books</li>
                                    <li>Find a Book</li>
                                    <button onClick={signOut}>Sign Out</button>
                                </ul>

                        </div>
                        <BookFinder />
                    </div> :
                    <div>
                        <button onClick={signInWithGoogle}>Sign in with Google</button>
                    </div>
                }
            </div>
        </div>
    )
}