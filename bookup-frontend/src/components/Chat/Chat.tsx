import { useEffect, useState } from "react";
import { Buser } from "../../models/User";
import "./Chat.css";
import { Message } from "../../models/Message";
import { getMessagesByUserBookID } from "../../services/messageService/messageService";

export function Chat(props: { currentUser: Buser, chatUser: Buser, chatUserIsbn: string }) {

    const [me, setme] = useState<Buser>(props.currentUser);
    const [other, setOther] = useState<Buser>(props.chatUser);
    const [isbn, setIsbn] = useState(props.chatUserIsbn);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newText, setNewText] = useState("");

    useEffect(() => {        
        if (me)
            getUserMessages(isbn, me._id!, other._id!);              
    },[])

    async function getUserMessages(isbn: string, user1_id: string, user2_id: string) {
        const userMessages = await getMessagesByUserBookID(isbn, user1_id, user2_id);        
        setMessages(userMessages);
        
    }

    async function handleSubmit (e: any) {
        e.preventdefault;
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        
        let initiator = (messages[0]) ? messages[0].initiator : props.currentUser._id;
                
        const newMessage = { "createdAt": isoDateTime, 
                       "initiator": initiator,
                       "isbn": isbn,
                       "receiverId": other._id,
                       "senderId": me._id,
                       "state": "",
                       "swapToIsbn": "",                       
                       "message": newText
                    }            
        const response = postMessage(newMessage);
        console.log(response);
      };

      const handleChange = (e: any) => {
        setNewText( e.target.value );
      };

    return (
        <div className="chatwrapper">
            <div className="chatSpace">
                <div className="chatusers">
                    {other.email}
                </div>
                <div className="chatWindow">
                    <ul className="chat" id="chatList">
                        <h2>Chat Messages</h2>          
                        {                            
                            messages.map(message =>
                            <div key={message._id}>
                                {me._id === message.senderId ?
                                (
                                    <li className="self">
                                        <div className="msg">
                                            <p>Me:</p>
                                            <div>{message.message}</div>                                            
                                        </div>
                                    </li>
                                ) : 
                                (
                                    <li className="other">
                                        <div className="msg">
                                           <p>Other:</p>
                                            <div className="message">{message.message}</div>
                                        </div>
                                    </li>
                                )}
                            </div>
                            )
                        }
                    </ul>
                    <div className="chatInputWrapper">                    
                        <input className="textarea input" type="text" placeholder="Enter your message..."
                        onChange={handleChange}/>                        
                        <button onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}