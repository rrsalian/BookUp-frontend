import { useEffect, useState } from "react";
import { Buser } from "../../models/User";
import "./ViewChat.css";
import { Message } from "../../models/Message";
import { getMessagesByUserBookID, postMessage } from "../../services/messageService/messageService";

export function ViewChat(props: { currentUser: Buser, chatUser: Buser, isbn: string, handleMessages: (messages: Message[]) => void, messages: Message[] }) {

    const [me, setme] = useState<Buser>(props.currentUser);
    const [other, setOther] = useState<Buser>(props.chatUser);
    const [isbn, setIsbn] = useState(props.isbn);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newText, setNewText] = useState("");

    useEffect(() => {
        if (me) {
            getUserMessages(isbn, me._id!, other._id!);            
        }
            
    }, [messages.length])

    function scrollToBottom() {
        const chat = document.getElementById("chatList")!;
        chat.scrollTop = chat?.scrollHeight;
      };

    async function getUserMessages(isbn: string, user1_id: string, user2_id: string) {
        const userMessages = await getMessagesByUserBookID(isbn, user1_id, user2_id);        
        setMessages(userMessages);        
        props.handleMessages(userMessages);
        
    }

    async function handleSubmit (e: any) {
        e.preventdefault;
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        
        let initiator:string = (messages[0]) ? messages[0].initiator!: props.currentUser._id!;
        let currentState = (messages.length === 0) ? "invite" : ""
                
        const newMessage:Message = { "createdAt": isoDateTime, 
                                     "initiator": initiator,
                                     "isbn": isbn,
                                     "receiverId": other._id!,
                                     "senderId": me._id!,
                                     "state": currentState,
                                     "swapToIsbn": "",                       
                                     "message": newText
                                    };
        
        await postMessage(newMessage);
        const newMessages: Message[] = [ ...messages, newMessage];
        setMessages( newMessages );
        setNewText("");        
        scrollToBottom();        
        props.handleMessages(messages)
               
      };

      const handleChange = (e: any) => {
        setNewText( e.target.value );
      };


    return (
        <div className="main">
            <div className="chatSpace">                
                <div className="chatWindow">
                    <ul className="chat" id="chatList">
                        <h3>Chat Messages</h3>
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
                                           <p>{other.email}</p>
                                            <div className="message">{message.message}</div>
                                        </div>
                                    </li>
                                )}
                            </div>
                            )
                        }
                    </ul>
                    <div className="chatInputWrapper">                    
                        <input className="textarea input" type="text" value={newText} placeholder="Enter your message..."
                        onChange={handleChange}/>
                        <button onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}