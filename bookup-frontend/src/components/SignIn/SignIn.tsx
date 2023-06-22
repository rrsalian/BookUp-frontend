import { FormEvent, useContext, useEffect, useState } from "react";
import { signInWithGoogle, signOut } from "../../firebaseConfig";
import AuthContext from "../../contexts/AuthContext";
import { BookFinder } from "../BookFinder/BookFinder";
import "./SignIn.css"
import bookUserPhoto from "../../images/5738803.png"
import { Buser } from "../../models/User";
import { USZip, zipList } from "../../models/USZip";
import { addUser, getUserByEmail } from "../../services/bookSearchService/userService";


export function SignIn() {

    const { user } = useContext(AuthContext);

    const [dropdown, setDropDown] = useState(false)
    
    const [zipcode, setZipcode] = useState("");

    const toggleDropDown = () => dropdown ? setDropDown(false) : setDropDown(true)

    function handleAddUser(e: FormEvent) {
        e.preventDefault();
        const myZip = zipList.filter(zip => zip.zip === zipcode);

        const newBuser: Buser = {
            uid: user!.uid,
            email: user!.email!,
            zipcode: {zip: myZip[0].zip, lat: myZip[0].lat, lon: myZip[0].lon},
            books: []

        }

        addUser(newBuser)
        setZipcode("");

    }

    useEffect(() => {
        getUserByEmail(user?.email!)
    },[])


    return (
        <div>
            <div>
                {user ?
                    <div>
                        <header className="header">
                            <nav className="navbar">
                                <div>
                                    <h1 className="logo">BookUp</h1>
                                </div>
                                <div>

                                </div>
                                <div>

                                </div>
                                <div className="user-profile">
                                    {!!user?.photoURL && <button><img onClick={toggleDropDown} className="user-photo" src={!user.photoURL ? bookUserPhoto : user.photoURL} alt="" width="40px" /></button>}

                                </div>

                            </nav>
                        </header>
                        <div className={dropdown ? "dropdown" : "hidden"}>
                            <p> {user.displayName} </p>
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