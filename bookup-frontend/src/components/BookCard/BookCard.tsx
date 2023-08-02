import { Link } from "react-router-dom"
import "./BookCard.css"
import { useEffect, useState } from "react"
import { Buser } from "../../models/User";



export function BookCard(props: { book: any, viewOnly: boolean, user: Buser, showBtnPopUp: boolean, onClose: () => void, showBookLocation: (isbn: string) => void, addBook: (isbn: string) => void, isbn: (isbn: string) => void }) {

    useEffect ( () => {
        console.log("in Book Card showPopUp" +  JSON.stringify(props.book.volumeInfo));
    },[])

    function handleIsbn() {
        props.addBook(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier : props.book.volumeInfo.industryIdentifiers[1].identifier);
        props.isbn(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier : props.book.volumeInfo.industryIdentifiers[1].identifier);
    }    

    if (props.showBtnPopUp) {
        return (
            <div className="popup-container">
                <div className="book-popup">
                    <button onClick={() => props.onClose()}>close</button>
                    <img className="book-image" src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" />
                    <p>Title: {props.book.volumeInfo.title}</p>
                    <p>Subtitle: {props.book.volumeInfo.subtitle}</p>
                    {
                        props.book.searchInfo.textSnippet ? <p>Text Snippet: {props.book.searchInfo.textSnippet}</p>
                        : <p>No description available</p>
                    }
                    {
                        props.book.volumeInfo.authors ? <address>Author/s: {props.book.volumeInfo.authors}</address>
                        : <address>Author/s: No author available</address>
                    }
                    <p>ISBN: 
                        {
                            props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier : props.book.volumeInfo.industryIdentifiers[1].identifier
                        }
                    </p>
                    <div className={ props.viewOnly ? "hidden":"viewOnly"}>
                    {
                        !props.user.books.includes(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier : props.book.volumeInfo.industryIdentifiers[1].identifier) ?
                            <div>
                                <button onClick={() => props.showBookLocation(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier : props.book.volumeInfo.industryIdentifiers[1].identifier)}>I Want This Book</button>
                                <button onClick={handleIsbn}>I have this book</button>
                            </div>
                            : <button disabled >Already have it</button>
                    }
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}