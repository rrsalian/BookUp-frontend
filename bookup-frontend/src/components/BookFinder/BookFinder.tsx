import axios from "axios";
import { FormEvent, useEffect, useState } from "react"
import { getBooks } from "../../services/bookSearchService/bookSearchService";
import { BookList } from "../BookList/BookList";
import "./BookFinder.css"
import { Buser } from "../../models/User";

export function BookFinder(props: { user: Buser, chatUser: (chatUser: Buser) => void, chatUserIsbn: (chatUserIsbn:string) => void }) {

    const [search, setSearch] = useState("");
    const [bookData, setBookData] = useState([])

    async function handleBookSearch(e: FormEvent) {
        e.preventDefault();
        await getBooks(search).then( result => {            
            const books = result.data.items.filter( function(item: any, index: number) {
                if (item.volumeInfo.industryIdentifiers && item.volumeInfo.imageLinks?.thumbnail) {
                    console.log(item.volumeInfo.imageLinks?.thumbnail);
                    return (item.volumeInfo.industryIdentifiers.length > 1);
                }
            });
            setBookData(books);            
        });
        console.log("BookData" + JSON.stringify(bookData.length));
    }

    function setOtherUser(bUser: Buser) {
        console.log("in BookFinder" + bUser);
        props.chatUser(bUser);
    }

    return (
        <div>
            <div className="bookfinder-container">
                <h2 className="find-a-book">Find a Book</h2>
                <form onSubmit={handleBookSearch}>
                    <input className="book-search" type="text" placeholder="enter a book" value={search} onChange={e => setSearch(e.target.value)} />
                    <div>
                        <button className="search-btn">Search</button>
                    </div>

                </form>
            </div>
            <BookList bookList={bookData} user={props.user} chatUser={chatUser => setOtherUser(chatUser)} chatUserIsbn={(chatUserIsbn) => props.chatUserIsbn(chatUserIsbn)} />
        </div>
    )
}