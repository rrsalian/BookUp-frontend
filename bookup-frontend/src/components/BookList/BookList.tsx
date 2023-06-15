import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"
import { BookMap } from "../BookMap/BookMap";
import { useState } from "react";


export function BookList(props: {bookList: any[]}) {

    const [showMap, setShowMap] = useState(false);
    let mapCon = showMap ?  <BookMap></BookMap> : "";
    return (
       <div> 
        <button onClick = {()=> setShowMap(!showMap)}> Toggle Map</button>
        {mapCon}
        <div className="booklist">
            {
                props.bookList.map((book, index) => <BookCard key={index} book={book}/>)
            }
        </div>
        </div>
    )
}