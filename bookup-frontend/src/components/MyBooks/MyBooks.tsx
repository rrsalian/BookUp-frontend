import { Link } from "react-router-dom";
import { Buser } from "../../models/User";
import { SetStateAction, useEffect, useState } from "react";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import { BookList } from "../BookList/BookList";
import { BookCard } from "../BookCard/BookCard";


export function MyBooks(props: {currentUser: Buser}) {

    const [userBookList, setUserBookList] = useState<any[]>([])
    let bookList: any[] = []
    
    useEffect(() => {
        
        for (let book of props.currentUser.books) {
            getBook(book).then(book=> {
                setUserBookList((book.data.items));
    
            });
    }
    
    console.log(bookList);
    
console.log(userBookList);

    },[])

    return (
        <div>
            <p><Link to="/">Back to home</Link></p>
            <div>
                <h2>My Books</h2>
                <ul>
                    {
                        userBookList.map(book => <div>
                             <img className="book-image" src={book.volumeInfo.imageLinks?.thumbnail!} alt="" />
                    <p>Title: {book.volumeInfo.title}</p>
                    <p>Subtitle: {book.volumeInfo.subtitle}</p>
                    <p>Text Snippet: {book.searchInfo.textSnippet}</p>
                    <address>Author/s: {book.volumeInfo.authors}</address>
                    <p>ISBN: {book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? book.volumeInfo.industryIdentifiers[0].identifier: book.volumeInfo.industryIdentifiers[1].identifier}</p>
                        </div>)
                    }
                </ul>
            </div>
        </div>
    )
}