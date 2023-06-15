import axios from "axios";
import { FormEvent, useEffect, useState } from "react"
import { getBooks } from "../../services/bookSearchService/bookSearchService";
import { BookList } from "../BookList/BookList";


export function BookFinder() {

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
            <h2>Find a Book</h2>
            <form onSubmit={handleBookSearch}>
                <input type="text" placeholder="enter a book" value={search} onChange={e => setSearch(e.target.value)} />
                <button>Search</button>
            </form>
            <BookList bookList={bookData}/>
        </div>
    )
}