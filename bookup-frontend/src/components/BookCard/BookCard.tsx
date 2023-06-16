import { Link } from "react-router-dom"
import "./BookCard.css"
import { BookView } from "../BookView/BookView"
import { useState } from "react"

export function BookCard(props: { book: any}) {

    const [bookPopup, setPopup] = useState(false);
    console.log(bookPopup);
    
        
        const toggleBookPopup = () => bookPopup === true ? setPopup(false) : setPopup(true);
   

    return (
        <div className="bookcard">
            {
                bookPopup ? <img className="book-image" src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" /> 
                : <button  onClick={toggleBookPopup} className="book-btn"><img className="book-image" src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" /></button>
            }
           
            <div className="popup-container">
                <div className={bookPopup ? "book-popup" : "hidden"}>
                    <button onClick={toggleBookPopup}>close</button>
                    <img className="book-image" src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" />
                    <p>Title: {props.book.volumeInfo.title}</p>
                    <p>Subtitle: {props.book.volumeInfo.subtitle}</p>
                    <p>Description: {props.book.volumeInfo.description}</p>
                    <address>Author/s: {props.book.volumeInfo.authors}</address>
                    <p>ISBN: {props.book.volumeInfo.industryIdentifiers[0].identifier}</p>
                    <button>Add to my Wishlist</button>
                    <button>I have this book</button>
                </div>
            </div>
        </div>
    )
}