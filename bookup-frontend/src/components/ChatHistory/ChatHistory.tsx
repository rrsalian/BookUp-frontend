import { useEffect, useState } from "react"
import { Buser } from "../../models/User"
import { getMessagesByUser } from "../../services/messageService/messageService";
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

    const [allInvites, setAllInvites] = useState<Message[]>([]);
    const [myInvites, setMyInvites] = useState<Message[]>([]);
    const [othersInvites, setOthersInvites] = useState<Message[]>([]);
    const [myMsgInfo, setUserMsgInfo] = useState<UserMessageInfo[]>([])
    const [otherMsgInfo, setOtherMsgInfo] = useState<UserMessageInfo[]>([])
    const [chatData, setChatData] = useState<UserMessageInfo>();
    const [goChat, setGoChat] = useState(false);
    const [closeChat, setCloseChat] = useState(false);
    const [otherUserBookPopup, setOtherUserBookPopup] = useState(false)
    const [lastMessage, setLastMessage] = useState<Message>()
    const [swapStatus, setSwapStatus] = useState(false)
    const [swappedBook, setSwappedBook] = useState("")




    useEffect(() => {
        console.log("in useEffect");
        getUserChatHistory(props.currentUser);
    }, [allInvites.length])


    function setChatSettingsData(usrmsginfo: UserMessageInfo) {
        if (chatData?.id !== usrmsginfo.id) {
            setCloseChat(true);
        }
        setChatData(usrmsginfo);
        console.log(usrmsginfo);
        setGoChat(true);
        console.log("CH: " + JSON.stringify(lastMessage));
        
    }

    async function getUserChatHistory(user: Buser) {
        let idCount = 0;
        const myChatHistory: Message[] = await getMessagesByUser(user._id!);
        console.log(myChatHistory);
        const getAllInvites = myChatHistory.filter((message) => message.state === "invite")
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
        console.log(otherBookList)
        console.log(bUser.books)
    }

    function swapBook(book: any) {
        console.log(book)
        const isbn = book.volumeInfo!.industryIdentifiers[0].type === "ISBN_13" ? book!.volumeInfo.industryIdentifiers[0].identifier: book!.volumeInfo.industryIdentifiers[1].identifier
        console.log(isbn);
        
        setSwappedBook(isbn)
        setSwapStatus(true)
        console.log(swappedBook);
        
    }

    async function swapComplete(book: any) {
        const date = new Date(); // Or the date you'd like converted.
        const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        
                
        /* const newMessage:Message = { "createdAt": isoDateTime, 
                                     "initiator": lastMessage?.initiator!,
                                     "isbn": swappedBook!.volumeInfo!.industryIdentifiers[0].type === "ISBN_13" ? swappedBook!.volumeInfo.industryIdentifiers[0].identifier: swappedBook!.volumeInfo.industryIdentifiers[1].identifier,
                                     "receiverId": other._id!,
                                     "senderId": me._id!,
                                     "state": currentState,
                                     "swapToIsbn": "",                       
                                     "message": newText
                                    };
        
        await postMessage(newMessage);
        const newMessages: Message[] = [ ...messages, newMessage]; */
    }


    return (
        <div>
            <Header></Header>
            {
                myMsgInfo.map((minvite, index) =>
                (
                    <div style={{ marginTop: 24, marginLeft: 12 }}>
                        <table>

                            <thead>
                                <tr>
                                    <th>
                                        <h3>My Invites</h3>
                                        <td>Book ISBN</td>
                                        <td>User</td>
                                    </th>
                                </tr>
                            </thead>
                            <tr key={minvite.id} >
                                <td>{minvite.msginfo.isbn}</td>
                                <td>{minvite.otheruser.email}</td>
                                <td><button onClick={() => setChatSettingsData(minvite)}>Open Chat</button></td>
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
                                <th>
                                    <td>Book ISBN</td>
                                    <td>User</td>
                                </th>
                            </tr>
                            <tr key={oinvite.id}>
                                <td>{oinvite.msginfo.isbn}</td>
                                <td>{oinvite.otheruser.email}</td>
                                <td><button onClick={() => setChatSettingsData(oinvite)}>Open Chat</button></td>
                            </tr>
                        </table>
                    </div>
                ))
            }
            {

                goChat ?
                    <div>
                        <button style={chatData?.otheruser._id === chatData?.msginfo.initiator ? { display: "block", margin: "auto" } : { display: "none" }} onClick={() => getOtherBookList(chatData?.otheruser!)}>View {chatData?.otheruser.email}'s books</button>
                        <ViewChat currentUser={props.currentUser} chatUser={chatData?.otheruser!} isbn={chatData?.msginfo.isbn!} lastMessage={(lm) => setLastMessage(lm)}></ViewChat>
                        <button onClick={() => { setGoChat(false) }}>Close</button>
                        <div className={otherUserBookPopup ? "other-book-list" : "hidden"}>
                            <button onClick={() => setOtherUserBookPopup(false)}> hide books</button>
                            <p>{chatData?.otheruser.email}'s books</p>
                            <div className="other-books-view">
                                
                                {
                                    otherBookList.map(book => <div className="other-book">
                                        <img src={book.volumeInfo.imageLinks?.thumbnail!} />
                                        <p>{book.volumeInfo.title}</p>
                                        <button disabled={swapStatus} onClick={() => swapBook(book)}>Ready to Swap</button>
                                    </div>)
                                }
                                
                            </div>
                            <button className={!swapStatus ? "hidden" : "swap-ready-button"} onClick={() => swapComplete(swappedBook)}>Complete Swap</button>
                        </div>
                    </div>

                    :
                    <></>
            }

        </div>
    )
}