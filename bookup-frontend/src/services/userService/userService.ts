import axios from "axios";
import { Buser } from "../../models/User";

export async function getUsers(): Promise<Buser[]> {
    const response = await axios
        .get<Buser[]>('https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users');
    return response.data;
}

export async function getUserById(_id: string): Promise<Buser> {
    const response = await axios.get<Buser>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/${_id}`);
    return response.data;
}

export async function getUserByEmail(email: string): Promise<Buser> {
    const response = await axios.get<Buser>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/email/${email}`);
    return response.data;
}

export async function getUserByIsbn(isbn: string): Promise<Buser> {
    const response = await axios.get<Buser>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/book/${isbn}`);
    return response.data;
}

export const addUser = async (user: Buser): Promise<Buser> => {
    return (await axios.post('https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users', user)).data;
};

export const updateUser = async (user: Buser, id: string) => {
    return (await axios.put(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/${id}`, user));
};

export async function deleteUser(_id: string): Promise<Buser> {
    const response = await axios.delete<Buser>(`https://us-central1-bookup-4c4c7.cloudfunctions.net/api/users/${_id}`);
    return response.data;
}