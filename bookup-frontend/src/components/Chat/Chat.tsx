import { Buser } from "../../models/User";

export function Chat( props : { currentUser: Buser , chatUser: Buser}) {

    console.log(props.chatUser);

    return (        
        <div>
            { props.currentUser._id }
            { props.chatUser._id }
        </div>
    )
}