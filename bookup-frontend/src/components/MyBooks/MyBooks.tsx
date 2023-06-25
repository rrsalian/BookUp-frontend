import { Link } from "react-router-dom";
import { Buser } from "../../models/User";
import { SetStateAction, useEffect, useState } from "react";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import { BookList } from "../BookList/BookList";
import { BookCard } from "../BookCard/BookCard";
import "./MyBooks.css";

export function MyBooks(props: {currentUser: Buser}) {

    const [userBookList, setUserBookList] = useState<any[]>([]);
    let bookList: any[] = []
    
    async function getUserBookList( bUser: Buser ) {
        for (let book of bUser.books) {
            
            let bArray: any[] = [];

            await getBook(book).then( book => {
                bArray = [ ...bArray , ...book.data.items];                
            })
            
            setUserBookList(bArray);
        }
    }

    useEffect(() => {        
        getUserBookList(props.currentUser);       
    },[props.currentUser]);
    
  
    return (
        <div>
            <p><Link to="/">Back to home</Link></p>
            <div>
                <h2>My Books</h2>
                <div className="mybooks">
                    {                        
                    userBookList.map( (book ,index) => 
                        <div className="book" key={book.id}>
                            <img  className="book-image" src={book.volumeInfo.imageLinks?.thumbnail!} alt="" />
                            <p>Title: {book.volumeInfo.title}</p>
                            <p>Subtitle: {book.volumeInfo.subtitle}</p>
                            <p>Text Snippet: {book.searchInfo.textSnippet}</p>
                            <address>Author/s: {book.volumeInfo.authors}</address>
                            <p>ISBN: {book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? book.volumeInfo.industryIdentifiers[0].identifier: book.volumeInfo.industryIdentifiers[1].identifier}</p>
                        </div>)
                    }
                </div>  
            </div>
        </div>
    )
}