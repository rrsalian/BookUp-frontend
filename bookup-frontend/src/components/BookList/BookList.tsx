import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"
import { BookMap } from "../BookMap/BookMap";
import { useEffect, useState } from "react";


export function BookList(props: {bookList: any[]}) {

    const [showBtnPopUp, setShowBtnPopUp] = useState(false);
    const [showBook, setShowBook] = useState({});
    const [showMap, setShowMap] = useState(false);
    let mapCon = showMap ?  <BookMap></BookMap> : "";

    const handleShowBtnPopUp = (book: any) => {
        if (!showBtnPopUp) {
            setShowBtnPopUp(true);
            setShowBook(book);
        }
    };

    const handleHideBtnPopUp = () => {
        if (showBtnPopUp) {
            setShowBtnPopUp(false);
            setShowBook({});
            console.log(showBtnPopUp);
        }
    }

    useEffect ( () => {
        console.log(showBtnPopUp);
    },[showBtnPopUp])
       
    return (
       <div> 
            <button onClick = {()=> setShowMap(!showMap)}> Toggle Map</button>
            {mapCon}
            <div className="booklist">
            {
                props.bookList.map((book, index) => 
                    (   
                        <div className="bookcard">
                            {
                            <button onClick={() => handleShowBtnPopUp(book)} className="book-btn"><img className="book-image" src={book.volumeInfo.imageLinks?.thumbnail} alt="" /></button>                            
                            }                        
                            <BookCard key={index} book={showBook} showBtnPopUp={showBtnPopUp} onClose={handleHideBtnPopUp}/>
                        </div>
                    )
                )
            }
            </div>
        </div>
    )
}