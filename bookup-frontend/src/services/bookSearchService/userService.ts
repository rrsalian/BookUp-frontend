import axios from "axios";
import { User } from "../../models/User";

export async function getUsers(): Promise<User[]> {
    const response = await axios
        .get<User[]>('https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users');
    return response.data;
}

export async function getUser(_id: string): Promise<User> {
    const response = await axios.get<User>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/${_id}`);
    return response.data;
}