import { Message } from "./Message";
import { Buser } from "./User";

export interface UserMessageInfo {
    id?: number;
    msginfo: Message;
    otheruser: Buser;
}