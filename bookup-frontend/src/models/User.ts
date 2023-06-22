import { USZip } from "./USZip";

export interface Buser {
    _id?: string,
    uid: string,
    email: string,
    zipcode: USZip,
    books: string[]
}