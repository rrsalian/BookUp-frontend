import { useEffect, useState } from "react"
import { Buser } from "../../models/User"
import { getMessagesByUser } from "../../services/messageService/messageService";
import { Message } from "../../models/Message";

export function ChatHistory( props: {currentUser: Buser}) {

    const [ myBooksOfInterest, setmyBooksOfInterest ] = useState<Buser[]>([]);
    const [ othersBooksOfInterest, setOthersBooksOfInterest ] = useState<Buser[]>([]);

    useEffect(() => {
        console.log("in useEffect");
        getUserChatHistory(props.currentUser);
    },[])

    async function getUserChatHistory(user: Buser) {
        const myChatHistory:Message[] = await getMessagesByUser(user._id!);
        console.log(myChatHistory);
    }

    return (
        <div>
            <ul>
                <li>

                </li>
            </ul>
        </div>
    )
}