import axios from "axios"


export const getBooks = async (search: string): Promise<any> => {
    return (await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=AIzaSyBAtIShjcw81Yux9Qem7DPY95B_HMY-pkw&maxResults=40`))
}

export const getBook = async (isbn: string): Promise<any> => {
    return (await axios.get(`https://www.googleapis.com/books/v1/volumes?q=+isbn:${isbn}&key=AIzaSyBAtIShjcw81Yux9Qem7DPY95B_HMY-pkw`))
}