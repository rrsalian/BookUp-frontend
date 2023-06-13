import axios from "axios";
import { FormEvent, useEffect, useState } from "react"
import { getBooks } from "../../services/bookSearchService/bookSearchService";


export function BookFinder() {

    const [search, setSearch] = useState("javascript");
    const [bookData, setBookData] = useState([])

    useEffect(() => {

        getBooks(search).then(books => {
            setBookData(books.data.items);
            console.log(books.data.items);
    
        });
    
    }, []);

    function handleBookSearch(e: FormEvent) {
        e.preventDefault();
    }

    return (
        <div>
            <h2>Find a Book</h2>
            <form onSubmit={handleBookSearch}>
                <input type="text" placeholder="enter a book" value={search} onChange={e => setSearch(e.target.value)} />
                <button>Search</button>
            </form>
        </div>
    )
}