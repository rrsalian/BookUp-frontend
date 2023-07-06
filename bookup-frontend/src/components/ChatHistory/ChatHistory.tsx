import { useEffect, useRef, useState } from "react"
import { Buser } from "../../models/User"
import { UpdateMessage, getMessagesByUser, postMessage } from "../../services/messageService/messageService";
import { Message } from "../../models/Message";
import { getUserById } from "../../services/userService/userService";
import { Header } from "../Header/Header";
import { ViewChat } from "../ViewChat/ViewChat";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import "./ChatHistory.css"

export function ChatHistory(props: { currentUser: Buser }) {

    interface UserMessageInfo {
        id: number;
        msginfo: Message;
        otheruser: Buser;
    }

    let myUserMsgInfo: UserMessageInfo[] = [];
    let OtherUserMsgInfo: UserMessageInfo[] = [];

    const [myChatHistory, setMyChatHistory] = useState<Message[]>([]);
    const [allInvites, setAllInvites] = useState<Message[]>([]);
    const [myInvites, setMyInvites] = useState<Message[]>([]);
    const [othersInvites, setOthersInvites] = useState<Message[]>([]);
    const [myMsgInfo, setUserMsgInfo] = useState<UserMessageInfo[]>([])
    const [otherMsgInfo, setOtherMsgInfo] = useState<UserMessageInfo[]>([])
    const [chatData, setChatData] = useState<UserMessageInfo>();
    const [goChat, setGoChat] = useState(false);
    const [openChatBtn, setOpenChatBtn] = useState(true);
    const [otherUserBookPopup, setOtherUserBookPopup] = useState(false)
    const [lastMessage, setLastMessage] = useState<Message>()
    const [swappedBook, setSwappedBook] = useState("");
    const [swapStatus, setSwapStatus] = useState(false);
    const [swapToFinish, setSwapToFinish] = useState(false);
    const [messages, setMessages] = useState<Message[]>();

    const myRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        console.log("in useEffect");
        getUserChatHistory(props.currentUser);
    }, [myChatHistory.length])

    function setChatSettingsData(usrmsginfo: UserMessageInfo) {
        setChatData(usrmsginfo);
        console.log("goChat " + goChat);
        if (!goChat) {
            setGoChat(true);
            setOpenChatBtn(false);
        }
        console.log("CH: " + JSON.stringify(lastMessage));

    }

    async function getUserChatHistory(user: Buser) {
        let idCount = 0;
        const getAllMyChatHistory: Message[] = await getMessagesByUser(user._id!);
        setMyChatHistory(getAllMyChatHistory);
        const getAllInvites = getAllMyChatHistory.filter((message) => message.state === "invite")
        setAllInvites(getAllInvites);
        setMyInvites(getAllInvites.filter((msg) => msg.initiator === props.currentUser._id));

        for (const myInvite of myInvites) {
            const getOtherUser: Buser = await getUserById(myInvite.receiverId);
            myUserMsgInfo.push({ "id": idCount, "msginfo": myInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
            console.log("MyUser " + JSON.stringify(myUserMsgInfo));
        }

        setUserMsgInfo(myUserMsgInfo);

        setOthersInvites(getAllInvites.filter((msg) => msg.initiator !== props.currentUser._id));

        for (const OthInvite of othersInvites) {
            const getOtherUser: Buser = await getUserById(OthInvite.senderId);
            OtherUserMsgInfo.push({ "id": idCount, "msginfo": OthInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
            console.log("Other User" + JSON.stringify(OtherUserMsgInfo));
        }
        setOtherMsgInfo(OtherUserMsgInfo);

    }

    const [otherBookList, setOtherBookList] = useState<any[]>([]);

    async function getOtherBookList(bUser: Buser) {
        setOtherUserBookPopup(true)
        let bArray: any[] = [];

        for (let book of bUser.books) {
            await getBook(book).then(book => bArray = [...bArray, ...book.data.items])
            setOtherBookList(bArray);
        }
        if (messages![messages!.length - 1].state === "Ready to swap") {
            setSwapStatus(true);
            setSwapToFinish(true);
        }
        scrollToBottom();
    }

    function handleMessages(msgReceived: Message[]) {
        setMessages(msgReceived);
    }

    async function readyToSwapBook(title: string, swapIsbn: string) {

        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        const lastMsg = `I am Ready to Swap a Book with title '${title}' and Isbn ${swapIsbn}`;

        setSwappedBook(swapIsbn);    // isn't working
        setSwapStatus(true);
        //console.log("chatData " + JSON.stringify(chatData));
        const newMessage: Message = {
            "createdAt": isoDateTime,
            "initiator": chatData?.msginfo.initiator!,
            "isbn": chatData?.msginfo.isbn!,
            "receiverId": chatData?.msginfo.initiator!,
            "senderId": chatData?.msginfo.receiverId!,
            "state": "Ready to swap",
            "swapToIsbn": `${swapIsbn}`,
            "message": lastMsg
        };

        await postMessage(newMessage);
        const newMessages: Message[] = [...messages!, newMessage];
        setMessages(newMessages);
        //console.log("last message " + JSON.stringify(sendMessage));

    }

    async function swapComplete(book: any) {
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        console.log("book " + JSON.stringify(book));

        const newMessage: Message = {
            "createdAt": isoDateTime,
            "initiator": chatData?.msginfo.initiator!,
            "isbn": chatData?.msginfo.isbn!,
            "receiverId": chatData?.msginfo.initiator!,
            "senderId": chatData?.msginfo.receiverId!,
            "state": "Swap Complete",
            "swapToIsbn": "",
            "message": "Book has been swapped"
        };

        await postMessage(newMessage);
        const newMessages: Message[] = [...messages!, newMessage];
        const msgIndex = newMessages.findIndex((msg => msg.state == "invite"));
        const firstMsg = newMessages[msgIndex];
        firstMsg.state = firstMsg.state + "|Complete";
        await UpdateMessage(firstMsg, firstMsg._id!);
        setMessages(newMessages);
        setSwapToFinish(false);
        console.log("newMessages " + JSON.stringify(messages));
    }

    function scrollToBottom() {
        const otherBookList = document.querySelector("other-book")!;
        myRef?.current?.scrollIntoView({ behavior: "smooth" })
    };


    return (
        <div>
            <Header></Header>
            {
                myMsgInfo.map((minvite, index) =>
                (
                    <div style={{ marginTop: 24, marginLeft: 12 }}>
                        <table>

                            <h3>My Invites</h3>
                            <tr>
                                <th>
                                    <td>Book ISBN</td>
                                    <td>User</td>
                                    
                                </th>
                            </tr>

                            <tr key={minvite.id} >
                                <td>{minvite.msginfo.isbn}</td>
                                <td>{minvite.otheruser.email}</td>
                                <td><button disabled={!openChatBtn} onClick={() => setChatSettingsData(minvite)}>Open Chat</button></td>
                            </tr>
                        </table>
                    </div>
                ))
            }

            {
                otherMsgInfo.map((oinvite, index) =>
                (
                    <div style={{ marginTop: 24, marginLeft: 12 }}>
                        <table>
                            <h3>Other Invites</h3>
                            <tr>
                                <th className="tblheader">
                                    <td>Book ISBN</td>
                                    <td>User</td>
                                    
                                </th>
                            </tr>
                            <tr key={oinvite.id}>
                                <td>{oinvite.msginfo.isbn}</td>
                                <td>{oinvite.otheruser.email}</td>
                                <td><button disabled={!openChatBtn} onClick={() => setChatSettingsData(oinvite)}>Open Chat</button></td>
                            </tr>
                        </table>
                    </div>
                ))
            }
            {

                goChat ?
                    <div>
                        <div className="chat-options">
                            <button disabled={otherUserBookPopup} style={chatData?.otheruser._id === chatData?.msginfo.initiator ? { display: "block", margin: "auto" } : { display: "none" }} onClick={() => getOtherBookList(chatData?.otheruser!)}>View {chatData?.otheruser.email}'s books</button>
                            <button onClick={() => { setGoChat(false); setOpenChatBtn(true); setOtherUserBookPopup(false) }}>Close Chat</button>
                        </div>
                        <ViewChat currentUser={props.currentUser} chatUser={chatData?.otheruser!} isbn={chatData?.msginfo.isbn!} handleMessages={handleMessages} messages={messages!}></ViewChat>

                        <div className={otherUserBookPopup ? "other-book-list" : "hidden"}>
                            <button onClick={() => setOtherUserBookPopup(false)}> hide books</button>
                            <p>{chatData?.otheruser.email}'s books</p>
                            <div className={(chatData?.otheruser._id === chatData?.msginfo.initiator) ? "other-books-view" : "hidden"}>
                                {
                                    otherBookList.map(book => <div ref={myRef} className="other-book">
                                        <img src={book.volumeInfo.imageLinks?.thumbnail!} />
                                        <p>{book.volumeInfo.title}</p>
                                        <button disabled={swapStatus} onClick={() => readyToSwapBook(book.volumeInfo.title, book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? book.volumeInfo.industryIdentifiers[0].identifier : book.volumeInfo.industryIdentifiers[1].identifier)
                                        }>Ready to Swap</button>
                                    </div>)
                                }

                            </div>
                            <button disabled={!swapToFinish} className={!swapStatus ? "hidden" : "swap-ready-button"} onClick={() => swapComplete(swappedBook)}>Complete Swap</button>
                        </div>
                    </div>

                    :
                    <></>
            }

        </div>
    )
}