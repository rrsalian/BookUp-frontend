export interface Message {
    _id?: string,
    createdAt: Date,
    initiator: string,
    isbn: string,
    receiverId: string,
    senderId: string,       
    swapToIsbn: string,
    state: string,
    message: string
}