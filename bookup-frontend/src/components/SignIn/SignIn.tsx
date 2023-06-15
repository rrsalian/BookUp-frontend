import { useContext } from "react";
import { signInWithGoogle, signOut } from "../../firebaseConfig";
import AuthContext from "../../contexts/AuthContext";
import { BookFinder } from "../BookFinder/BookFinder";


export function SignIn() {

    const { user } = useContext(AuthContext);

    return (
        <div>            
            
            <div>                
                { user ?
                <div>
                    <h2> Welcome {user.displayName} </h2>
                    <button onClick={signOut}>Sign Out</button>
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