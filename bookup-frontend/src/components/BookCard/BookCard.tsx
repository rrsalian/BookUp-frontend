import { Link } from "react-router-dom"
import "./BookCard.css"
import { BookView } from "../BookView/BookView"
import { useEffect, useState } from "react"

export function BookCard(props: { book: any, showBtnPopUp:boolean, onClose: () => void }) {


    if (props.showBtnPopUp) {
        return (
            <div className="popup-container">
                <div className={props.showBtnPopUp? "book-popup":"hidden"} >
                    <button onClick={() => props.onClose()}>close</button>
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
        );
    }
    else {
        return (
            <div></div>
        );
    }
}