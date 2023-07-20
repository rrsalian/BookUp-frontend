import { useEffect, useRef, useState } from "react";
import { Buser } from "../../models/User";
import "./ViewChat.css";
import { Message } from "../../models/Message";
import { UpdateMessage, getMessagesByUserBookID, postMessage } from "../../services/messageService/messageService";
import { UserMessageInfo } from "../../models/UserMessageInfo";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import { log } from "console";
import { updateUser } from "../../services/userService/userService";

export function ViewChat(props: { currentUser: Buser, chatData: UserMessageInfo, onClose: () => void }) {

    const [me, setMe] = useState<Buser>(props.currentUser);
    const [other, setOther] = useState<Buser>(props.chatData?.otheruser!);
    const [isbn, setIsbn] = useState(props.chatData?.msginfo?.isbn!);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newText, setNewText] = useState("");
    const [otherUserBookPopup, setOtherUserBookPopup] = useState(false)
    const [otherBookList, setOtherBookList] = useState<any[]>([]);
    const [swappedBook, setSwappedBook] = useState("");
    const [swapStatus, setSwapStatus] = useState(false);
    const [swapCompleteToFinish, setSwapCompleteToFinish] = useState(true);

    const myRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (me && other) {
            console.log("in viewchat useEffect " + isbn);

            getUserMessages(isbn, me._id!, other._id!);
        }
    }, [])

    async function getUserMessages(isbn: string, user1_id: string, user2_id: string) {
        const userMessages = await getMessagesByUserBookID(isbn, user1_id, user2_id);
        setMessages(userMessages);
    }

    async function getOtherBookList(bUser: Buser) {
        setOtherUserBookPopup(true)
        let bArray: any[] = [];

        for (let book of bUser.books) {
            await getBook(book).then((book) => bArray = [...bArray, ...book.data.items]);
            setOtherBookList(bArray);
        }
        if (messages![messages!.length - 1].state === "Ready to swap") {
            setSwapStatus(true);
            setSwapCompleteToFinish(true);            
        }
        scrollToBottom();
    }

    function scrollToBottom() {
        const chat = document.getElementById("chatList")!;
        chat.scrollTop = chat?.scrollHeight;
    };

    function sendClosechat() {
        setOtherUserBookPopup(false);
        props.onClose();
    }

    async function handleSubmit(e: any) {
        e.preventdefault;
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

        let initiator: string = (messages[0]) ? messages[0].initiator! : props.currentUser._id!;
        let currentState = (messages.length === 0) ? "invite" : ""

        const newMessage: Message = {
            "createdAt": isoDateTime,
            "initiator": initiator,
            "isbn": isbn,
            "receiverId": other._id!,
            "senderId": me._id!,
            "state": currentState,
            "swapToIsbn": "",
            "message": newText
        };

        await postMessage(newMessage);
        const newMessages: Message[] = [...messages, newMessage];
        setMessages(newMessages);
        setNewText("");
        scrollToBottom();
    };

    const handleChange = (e: any) => {
        setNewText(e.target.value);
    };

    // function scrollToBottom() {
    //     const otherBookList = document.querySelector("other-book")!;
    //     myRef?.current?.scrollIntoView({ behavior: "smooth" })
    // };

    async function readyToSwapBook(title: string, swapIsbn: string) {

        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        const lastMsg = `I am Ready to Swap a Book with title '${title}' and Isbn ${swapIsbn}`;

        setSwappedBook(swapIsbn);    // isn't working
        console.log("swappedBook " + swappedBook)
        const newMessage: Message = {
            "createdAt": isoDateTime,
            "initiator": props.chatData?.msginfo.initiator!,
            "isbn": props.chatData?.msginfo.isbn!,
            "receiverId": props.chatData?.msginfo.initiator!,
            "senderId": props.chatData?.msginfo.receiverId!,
            "state": "Ready to swap",
            "swapToIsbn": `${swapIsbn}`,
            "message": lastMsg
        };

        await postMessage(newMessage);
        const newMessages: Message[] = [...messages!, newMessage];
        setMessages(newMessages);
        if (messages[messages.length - 1].state = "Ready To Swap") {
            setSwapStatus(true);
            setSwapCompleteToFinish(true);
        }
        else {
            setSwapStatus(false);
            setSwapCompleteToFinish(false);
        }

        scrollToBottom();
    }

    async function swapComplete() {
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                
        const newMessage: Message = {
            "createdAt": isoDateTime,
            "initiator": props.chatData?.msginfo.initiator!,
            "isbn": props.chatData?.msginfo.isbn!,
            "receiverId": props.chatData?.msginfo.initiator!,
            "senderId": props.chatData?.msginfo.receiverId!,
            "state": "Swap Complete",
            "swapToIsbn": messages[messages.length - 1].swapToIsbn,
            "message": "Book has been swapped"
        };

        await postMessage(newMessage);
        const newMessages: Message[] = [...messages!, newMessage];
        const msgIndex = newMessages.findIndex((msg => msg.state === "invite"));
        const firstMsg = newMessages[msgIndex];
        firstMsg.state = firstMsg.state + "|Complete";
        await UpdateMessage(firstMsg, firstMsg._id!);
        setMessages(newMessages);
        setSwapCompleteToFinish(false);
        console.log("newMessage " + JSON.stringify(newMessage));
        let myUser = Object.assign(props.currentUser);      //shallow copy stores references of object to the original memory address
        let otherUser = Object.assign(props.chatData.otheruser);
        const myBooks = Object.assign(props.currentUser.books);
        const otherBooks = Object.assign(props.chatData.otheruser.books);
        
        const myBkIndex = props.currentUser.books.findIndex((isbn) => isbn === props.chatData?.msginfo.isbn!);
        const otherBkIndex = props.chatData.otheruser.books.findIndex((isbn) => isbn === swappedBook );
        console.log("myBooks before swap " + myBooks);
        myBooks.splice(myBkIndex, 1, messages[messages.length - 1].swapToIsbn);
        otherBooks.splice(otherBkIndex, 1, props.chatData?.msginfo.isbn!);
        await updateUser(myUser, myUser._id);
        await updateUser(otherUser, otherUser._id);
        setMe(myUser);
        setOther(otherUser);
    }

    return (
        <div className="main">
            <div className="chat-options">
                <button className="btn" disabled={otherUserBookPopup} style={props.chatData?.otheruser._id === props.chatData?.msginfo.initiator ? { display: "block", margin: "auto" } : { display: "none" }} 
                        onClick={() => getOtherBookList(props.chatData?.otheruser!)}>View {props.chatData?.otheruser.email}'s books</button>
                <button className="btn" onClick={sendClosechat}>Close Chat</button>
            </div>
            <div className="chatSpace">
                <h3>Chat Messages</h3>
                <div className="chatWindow">

                    <ul className="chat" id="chatList">
                        {
                            messages.map(message =>
                                <div key={message._id}>
                                    {me._id === message.senderId ?
                                        (
                                            <div className="self">
                                                <div className="msg">
                                                    <p>Me:</p>
                                                    <div>{message.message}</div>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div className="other">
                                                <div className="msg">
                                                    <p>{other.email}:</p>
                                                    <div className="message">{message.message}</div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )
                        }
                    </ul>

                </div>
                <div className="chatInputWrapper">
                    <input className="textarea input" type="text" value={newText} placeholder="Enter your message..."
                        onChange={handleChange} />
                    <button className="btn" onClick={handleSubmit}>Send</button>
                </div>
            </div>

            <div className={otherUserBookPopup ? "other-book-list" : "hidden"}>
                <button className="btn" onClick={() => setOtherUserBookPopup(false)}> hide books</button>
                <p>{props.chatData?.otheruser.email}'s books</p>
                <div className={(props.chatData?.otheruser._id === props.chatData?.msginfo.initiator) ? "other-books-view" : "hidden"}>
                    {
                        otherBookList.map(book => <div ref={myRef} className="other-book">
                            <img src={book.volumeInfo.imageLinks?.thumbnail!} />
                            <p>{book.volumeInfo.title}</p>
                            <button className="btn" disabled={swapStatus} onClick={() => readyToSwapBook(book.volumeInfo.title, book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? book.volumeInfo.industryIdentifiers[0].identifier : book.volumeInfo.industryIdentifiers[1].identifier)
                            }>Ready to Swap</button>
                        </div>)
                    }

                </div>
                <button disabled={!swapCompleteToFinish} className={!swapStatus ? "hidden": "swap-ready-button" } onClick={() => swapComplete()}>Complete Swap</button>
            </div>
        </div>
    )

}