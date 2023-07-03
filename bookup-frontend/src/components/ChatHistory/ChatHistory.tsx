import { useEffect, useState } from "react"
import { Buser } from "../../models/User"
import { getMessagesByUser } from "../../services/messageService/messageService";
import { Message } from "../../models/Message";
import { getUserById } from "../../services/userService/userService";
import { Header } from "../Header/Header";

export function ChatHistory(props: { currentUser: Buser }) {

    interface UserMessageInfo {
        msginfo: Message;
        useremail: string;
    }

    let myUserMsgInfo: UserMessageInfo[] = [];
    let OtherUserMsgInfo: UserMessageInfo[] = [];

    const [allInvites, setAllInvites] = useState<Message[]>([]);
    const [myInvites, setMyInvites] = useState<Message[]>([]);
    const [othersInvites, setOthersInvites] = useState<Message[]>([]);
    const [myMsgInfo, setUserMsgInfo] = useState<UserMessageInfo[]>([])
    const [otherMsgInfo, setOtherMsgInfo] = useState<UserMessageInfo[]>([])

    useEffect(() => {
        console.log("in useEffect");
        getUserChatHistory(props.currentUser);
    }, [allInvites.length])

    async function getUserChatHistory(user: Buser) {        
        const myChatHistory: Message[] = await getMessagesByUser(user._id!);
        console.log(myChatHistory);
        const getAllInvites = myChatHistory.filter((message) => message.state === "invite")
        setAllInvites(getAllInvites);
        setMyInvites(getAllInvites.filter((msg) => msg.initiator === props.currentUser._id));
        
        for (const myInvite of myInvites) {
            const getOtherUser: Buser = await getUserById(myInvite.receiverId);
            myUserMsgInfo.push({ "msginfo": myInvite, "useremail": getOtherUser.email });
            console.log("MyUser " + JSON.stringify(myUserMsgInfo));
        }
        
        setUserMsgInfo(myUserMsgInfo);

        setOthersInvites(getAllInvites.filter((msg) => msg.initiator !== props.currentUser._id));

        for (const OthInvite of othersInvites) {
            const getOtherUser: Buser = await getUserById(OthInvite.senderId);
            OtherUserMsgInfo.push({ "msginfo": OthInvite, "useremail": getOtherUser.email });
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
                        <tr key={index} onClick={() => console.log(index)}>
                            <td>{minvite.msginfo.isbn}</td>
                            <td>{minvite.useremail}</td>                            
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
                        <tr key={index} onClick={() => console.log(index)}>
                            <td>{oinvite.msginfo.isbn}</td>
                            <td>{oinvite.useremail}</td>
                            <td><button value={oinvite.msginfo._id}>chat</button></td>
                        </tr>
                    </table>
                    </div>
                ))
            }
        </div>
    )
}