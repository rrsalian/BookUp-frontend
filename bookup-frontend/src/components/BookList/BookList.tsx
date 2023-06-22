import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"
import { BookMap } from "../BookMap/BookMap";
import { useEffect, useState } from "react";
import { Buser } from "../../models/User";


export function BookList(props: {bookList: any[], user:Buser}) {

    const [showBtnPopUp, setShowBtnPopUp] = useState(false);
    const [showBook, setShowBook] = useState({});
    const [showMap, setShowMap] = useState(false);

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

    const showBookLocation = () => {
        setShowMap(!showMap);
    }

    useEffect ( () => {
        console.log(showBtnPopUp);
    },[showBtnPopUp])
     
    let mapCon = showMap ?  <BookMap user={props.user} closeMap={showBookLocation}></BookMap> : "";

    return (
       <div> 
    
            {mapCon}
            <div className="booklist">
            {
                props.bookList.map((book, index) => 
                    (   
                        <div className="bookcard">
                            {
                            <button onClick={() => handleShowBtnPopUp(book)} className="book-btn"><img className="book-image" src={book.volumeInfo.imageLinks?.thumbnail} alt="" /></button>                            
                            }                        
                            <BookCard key={index} book={showBook} showBtnPopUp={showBtnPopUp} onClose={handleHideBtnPopUp} showBookLocation={showBookLocation}/>
                        </div>
                    )
                )
            }
            </div>
        </div>
    )
}