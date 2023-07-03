import { FormEvent, useContext, useEffect, useState } from "react";
import { signInWithGoogle, signOut } from "../../firebaseConfig";
import AuthContext from "../../contexts/AuthContext";
import { BookFinder } from "../BookFinder/BookFinder";
import "./SignIn.css"
import { Buser } from "../../models/User";
import { zipList } from "../../models/USZip";
import { addUser, getUserByEmail } from "../../services/userService/userService";

import googleLogo from "../../images/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
import { Header } from "../Header/Header";


export function SignIn(props: { activeUser: (activeUser: Buser) => void, chatUser: (chatUser: Buser) => void , chatUserIsbn: (chatUserIsbn: string) => void } ) {

    const { user } = useContext(AuthContext);

    const [zipcode, setZipcode] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [bUser, setBuser] = useState<Buser>();

    function handleAddUser(e: FormEvent) {
        e.preventDefault();
        const myZip = zipList.filter(zip => zip.zip === zipcode);
        if (myZip.length === 0) {
            alert("Please enter a valid zip Code");
        } else {
            const newBuser: Buser = {
                uid: user!.uid,
                email: user!.email!,
                zipcode: { zip: myZip[0].zip, lat: myZip[0].lat, lon: myZip[0].lon },
                books: [],
                img: user!.photoURL!
            }

            addUser(newBuser)
            setZipcode("");
            setBuser(newBuser);
            setIsLoggedIn(true);
        }
    }

    useEffect(() => {
        console.log(user?.photoURL);
        
        const foundUser = getUserByEmail(user?.email!).then((res) => { setIsLoggedIn(res !== null); setBuser(res); props.activeUser(res!) })
        console.log(foundUser);
    }, [user])

    async function checkLogin() {
        let res = await signInWithGoogle();
        setBuser(await getUserByEmail(res?.email!));
        setIsLoggedIn(res !== null && bUser !== null)
    }

    if (user && !isLoggedIn) {
        return (
            <form>
                <label>Enter your zip to find your next book</label>
                <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
                <button onClick={handleAddUser}>Submit</button>
                <button onClick={signOut}>Sign Out</button>
            </form>
        )
    }

    if (user && isLoggedIn) {
        return (
            <div>
                <div>
                    <div>
                        <Header></Header>
                        <BookFinder user={bUser!} chatUser={chatUser => props.chatUser(chatUser)} chatUserIsbn = {(chatUserIsbn) => props.chatUserIsbn(chatUserIsbn)} />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="sign-in-background">
                <div className="sign-in-box">
                    <h2 className="sign-in-logo">BookUp</h2>
                    <div className="sign-in-caption-container">
                        <p className="sign-in-caption">Sign in below using your Google Account to access the BookUp app.</p>
                    </div>
                    <button className="sign-in-button" onClick={checkLogin}><div><img className="google-logo" src={googleLogo} alt="" /></div><div>Sign in with Google</div></button>
                </div>
            </div>
        )
    }
}