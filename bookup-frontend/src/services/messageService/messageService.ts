import axios from "axios";
import { Message } from "../../models/Message";

export async function getMessageById(_id: string): Promise<Message> {
    const response = await axios
        .get<Message>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages/${_id}`);
    
    return response.data;
}

export async function getMessagesByUserBookID(bookId: string, user1: string, user2: string): Promise<Message[]> {
    const response = await axios
        .get<Message[]>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages/${bookId}/${user1}/${user2}`);
    return response.data;
}

export async function getMessagesByUser(user: string): Promise<Message[]> {
    const response = await axios
        .get<Message[]>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages/user/${user}`);
    return response.data;
}

/* Calling this should be a rare event as it will fetch the entire collection */
export async function getAllMessages(): Promise<Message[]> {
    const response = await axios
        .get<Message[]>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages`);
    return response.data;
}

export async function postMessage(message: Message): Promise<Message> {
    const response = await axios
        .post('https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages', message);
     return response.data;
}

export async function UpdateMessage(message: Message, _id: string): Promise<Message> {
    const response = await axios
        .put(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages/${_id}`, message);
     return response.data;
}


export async function deleteUser(_id: string): Promise<Message> {
    const response = await axios.delete<Message>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/messages/${_id}`);
    return response.data;
}
