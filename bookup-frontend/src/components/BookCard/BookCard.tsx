import { Link } from "react-router-dom"
import "./BookCard.css"
import { BookView } from "../BookView/BookView"
import { useEffect, useState } from "react"



export function BookCard(props: { book: any, showBtnPopUp:boolean, onClose: () => void, showBookLocation: (isbn: string) => void , addBook: (isbn: string) => void, isbn: (isbn: string) => void}) {

    function handleIsbn() {
        props.addBook(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier: props.book.volumeInfo.industryIdentifiers[1].identifier);
        props.isbn(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier: props.book.volumeInfo.industryIdentifiers[1].identifier);
    }

    if (props.showBtnPopUp) {
        return (
            <div className="popup-container">
                <div className={props.showBtnPopUp? "book-popup":"hidden"} >
                    <button onClick={() => props.onClose()}>close</button>
                    <img className="book-image" src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" />
                    <p>Title: {props.book.volumeInfo.title}</p>
                    <p>Subtitle: {props.book.volumeInfo.subtitle}</p>
                    <p>Text Snippet: {props.book.searchInfo.textSnippet}</p>
                    <address>Author/s: {props.book.volumeInfo.authors}</address>
                    <p>ISBN: { props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier: props.book.volumeInfo.industryIdentifiers[1].identifier}</p>
                    <button onClick={() => props.showBookLocation(props.book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? props.book.volumeInfo.industryIdentifiers[0].identifier: props.book.volumeInfo.industryIdentifiers[1].identifier)}>I Want This Book</button>
                    <button onClick={handleIsbn}>I have this book</button>
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