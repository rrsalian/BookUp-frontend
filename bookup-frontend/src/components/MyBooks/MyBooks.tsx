import { Link } from "react-router-dom";
import { Buser } from "../../models/User";
import { useEffect, useState } from "react";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import "./MyBooks.css";
import { Header } from "../Header/Header";

export function MyBooks(props: {currentUser: Buser}) {

    const [userBookList, setUserBookList] = useState<any[]>([]);
        
    async function getUserBookList( bUser: Buser ) {
        let bArray: any[] = [];

        for (let book of bUser.books) {                
            await getBook(book).then( book => bArray = [ ...bArray , ...book.data.items ])
            setUserBookList(bArray);            
        }
    }

    useEffect(() => {        
        console.log("useEffect");
        getUserBookList(props.currentUser);        
    },[props.currentUser]);
    
  
    return (
        <div>
            <Header></Header>            
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