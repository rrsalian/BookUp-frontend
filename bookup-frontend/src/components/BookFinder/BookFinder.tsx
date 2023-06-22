import axios from "axios";
import { FormEvent, useEffect, useState } from "react"
import { getBooks } from "../../services/bookSearchService/bookSearchService";
import { BookList } from "../BookList/BookList";
import "./BookFinder.css"
import { Buser } from "../../models/User";

export function BookFinder(props: {user:Buser}) {

    const [search, setSearch] = useState("");
    const [bookData, setBookData] = useState([])

    /* useEffect(() => {

        getBooks(search).then(books => {
            setBookData(books.data.items);
            console.log(books.data.items);
    
        });
    
    }, []); */


    function handleBookSearch(e: FormEvent) {
        e.preventDefault();
        getBooks(search).then(books => {
            setBookData(books.data.items);
            console.log(books.data.items)

        });

    }

    return (
        <div>
            <h2 className="find-a-book">Find a Book</h2>
            <form onSubmit={handleBookSearch}>
                <input className="book-search" type="text" placeholder="enter a book" value={search} onChange={e => setSearch(e.target.value)} />
                <div>
                    <button className="search-btn">Search</button>
                </div>
            </form>
            <BookList bookList={bookData} user={props.user} />
        </div>
    )
}