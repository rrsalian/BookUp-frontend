import { USZip } from "./USZip";

export interface User {
    _id?: string,
    uid: string,
    email: string,
    zipcode: USZip,
    books: string[]
}