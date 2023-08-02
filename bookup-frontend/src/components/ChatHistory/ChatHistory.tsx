import { useEffect, useRef, useState } from "react"
import { Buser } from "../../models/User"
import { getMessagesByUser } from "../../services/messageService/messageService";
import { Message } from "../../models/Message";
import { getUserById } from "../../services/userService/userService";
import { Header } from "../Header/Header";
import { ViewChat } from "../ViewChat/ViewChat";
import "./ChatHistory.css"
import { UserMessageInfo } from "../../models/UserMessageInfo";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import { BookCard } from "../BookCard/BookCard";


export function ChatHistory(props: { currentUser: Buser }) {

    let myUserMsgInfo: UserMessageInfo[] = [];
    let OtherUserMsgInfo: UserMessageInfo[] = [];

    const [myChatHistory, setMyChatHistory] = useState<Message[]>([]);
    const [allInvites, setAllInvites] = useState<Message[]>([]);
    const [myInvites, setMyInvites] = useState<Message[]>([]);
    const [othersInvites, setOthersInvites] = useState<Message[]>([]);
    const [myMsgInfo, setUserMsgInfo] = useState<UserMessageInfo[]>([])
    const [otherMsgInfo, setOtherMsgInfo] = useState<UserMessageInfo[]>([])
    const [chatData, setChatData] = useState<UserMessageInfo>();
    const [openChatBtn, setOpenChatBtn] = useState(true);
    const [rowIsActive, setRowIsActive] = useState(-1);
    const [showBtnPopUp, setShowBtnPopUp] = useState(false);
    const [showBook, setShowBook] = useState<any>({});
    const [isbn, setIsbn] = useState("");    
    
    const myRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        getUserChatHistory(props.currentUser);
    }, [myChatHistory.length])


    function setChatSettingsData(usrmsginfo: UserMessageInfo) {
        setChatData(usrmsginfo);
        setOpenChatBtn(false); 
        setRowIsActive(usrmsginfo.id!);
    }

    async function getUserChatHistory(user: Buser) {
        let idCount = 0;

        const getAllMyChatHistory: Message[] = await getMessagesByUser(user._id!);
        //console.log(getAllMyChatHistory);
        setMyChatHistory(getAllMyChatHistory);
        //console.log("myChatHistory " + JSON.stringify(myChatHistory));
        const getAllInvites = getAllMyChatHistory.filter((message) => message.state === "invite")
        setAllInvites(getAllInvites);
        setMyInvites(getAllInvites.filter((msg) => msg.initiator === props.currentUser._id));
        //console.log("myInvites " + JSON.stringify(myInvites));

        for (const myInvite of myInvites) {
            const getOtherUser: Buser = await getUserById(myInvite.receiverId);
            myUserMsgInfo.push({ "id": idCount, "msginfo": myInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
        }

        setUserMsgInfo(myUserMsgInfo);
        setOthersInvites(getAllInvites.filter((msg) => msg.initiator !== props.currentUser._id));

        for (const OthInvite of othersInvites) {
            const getOtherUser: Buser = await getUserById(OthInvite.senderId);
            OtherUserMsgInfo.push({ "id": idCount, "msginfo": OthInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
            //console.log("Other User" + JSON.stringify(OtherUserMsgInfo));
        }
        setOtherMsgInfo(OtherUserMsgInfo);
    }

    function handleOnClose() {       
        setOpenChatBtn(true);
        setRowIsActive(-1);
    }

    async function handleShowBtnPopUp(bIsbn: string) {        
        const book = await getBook(bIsbn).then( book => book.data.items );        
        if (!showBtnPopUp) {
            setIsbn(bIsbn);
            setShowBtnPopUp(true);
            setShowBook(book[0]);
        }
    }

    const handleHideBtnPopUp = () => {
        if (showBtnPopUp) {
            setShowBtnPopUp(false);
            setShowBook({});
            console.log(showBtnPopUp);
        }
    }

    function showBookLocation(bIsbn: string) {
        console.log("showBookLocation");
    }

    function addBook(bIsbn: string) {
        console.log(addBook);
    }

    return (
        <div className="main-histry">
            <Header></Header>
            <div className="section">
                <div className="histry">
                    {
                        myMsgInfo.map((minvite, index) =>
                        (
                            <div className="myInterests">
                                <h3>My Interests</h3>
                                <table className="styled-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Book ISBN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={minvite.id} className={rowIsActive === minvite.id ? "active-row":"tblrow"}>
                                            <td>{minvite.otheruser.email}</td>
                                            <td>{minvite.msginfo.isbn}</td>
                                            <td className="chatbtn"><button className="btn" disabled={!openChatBtn} onClick={() => setChatSettingsData(minvite)}>Open Chat</button></td>
                                            <td className="chatbtn"><button className="btn" disabled={!openChatBtn} onClick={() => handleShowBtnPopUp(minvite.msginfo.isbn)}>View Book</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    }

                    {
                        otherMsgInfo.map((oinvite, index) =>
                        (
                            <div className="otherInterests">
                                <h3>Other Interests in your Books</h3>
                                <table className="styled-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Book ISBN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={oinvite.id} className={rowIsActive === oinvite.id ? "active-row":"tblrow"}>
                                            <td>{oinvite.otheruser.email}</td>
                                            <td>{oinvite.msginfo.isbn}</td>
                                            <td className="chatbtn"><button className="btn" disabled={!openChatBtn} onClick={() => setChatSettingsData(oinvite)}>Open Chat</button></td>
                                            <td className="chatbtn"><button className="btn" disabled={!openChatBtn} onClick={() => handleShowBtnPopUp(oinvite.msginfo.isbn)}>View My Book</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    }                    
                    <BookCard book={showBook} viewOnly={true} user={props.currentUser} showBtnPopUp={showBtnPopUp} onClose={handleHideBtnPopUp} showBookLocation={(isbn) => showBookLocation(isbn)} addBook={(isbn) => addBook(isbn)} isbn={() => setIsbn(isbn)}/>
                </div>
                <div>
                {
                    !openChatBtn ?
                        <div>
                            <ViewChat currentUser={props.currentUser} chatData={chatData!} onClose={handleOnClose}></ViewChat>
                        </div>
                        :
                        <></>
                }
                </div>
            </div>
        </div>
    )
}
