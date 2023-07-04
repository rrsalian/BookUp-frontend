import { useEffect, useState } from "react"
import { Buser } from "../../models/User"
import { getMessagesByUser } from "../../services/messageService/messageService";
import { Message } from "../../models/Message";
import { getUserById } from "../../services/userService/userService";
import { Header } from "../Header/Header";
import { ViewChat } from "../ViewChat/ViewChat";

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
            myUserMsgInfo.push({"id": idCount, "msginfo": myInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
            console.log("MyUser " + JSON.stringify(myUserMsgInfo));
        }
        
        setUserMsgInfo(myUserMsgInfo);

        setOthersInvites(getAllInvites.filter((msg) => msg.initiator !== props.currentUser._id));

        for (const OthInvite of othersInvites) {
            const getOtherUser: Buser = await getUserById(OthInvite.senderId);
            OtherUserMsgInfo.push({"id": idCount, "msginfo": OthInvite, "otheruser": getOtherUser });
            idCount = idCount + 1;
            console.log("Other User" + JSON.stringify(OtherUserMsgInfo));
        }
        setOtherMsgInfo(OtherUserMsgInfo);
    }


    return (
        <div>
            <Header></Header>            
            {                
                myMsgInfo.map((minvite, index) =>
                ( 
                    <div style={{ marginTop: 24, marginLeft: 12 }}>
                    <table>
                        <h3>My Invites</h3>
                        <thead>
                        <tr>                            
                            <th>
                                <td>Book ISBN</td>
                                <td>User</td>
                            </th>
                        </tr>
                        </thead>                        
                        <tr key={minvite.id} onClick={() => setChatSettingsData(minvite)}>
                            <td>{minvite.msginfo.isbn}</td>
                            <td>{minvite.otheruser.email}</td>                                                    
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
                        <tr key={oinvite.id} onClick={() => setChatSettingsData(oinvite)}>
                            <td>{oinvite.msginfo.isbn}</td>
                            <td>{oinvite.otheruser.email}</td>
                        </tr>
                    </table>
                    </div>
                ))
            }
            {

            goChat ? 
                <div>
                    <ViewChat currentUser={props.currentUser} chatUser={chatData?.otheruser!} isbn={chatData?.msginfo.isbn!}></ViewChat>
                    <button onClick={()=> {setGoChat(false)}}>Close</button>
                </div>
           
            :
            <></>
            }
            
        </div>
    )
}