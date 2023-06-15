import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"
import { BookMap } from "../BookMap/BookMap";


export function BookList(props: {bookList: any[]}) {

    return (
       <div> 
        <BookMap></BookMap>
        <div className="booklist">
            {
                props.bookList.map((book, index) => <BookCard key={index} book={book}/>)
            }
        </div>
        </div>
    )
}