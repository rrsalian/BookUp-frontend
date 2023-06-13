import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"


export function BookList(props: {bookList: any[]}) {

    return (
        <div className="booklist">
            {
                props.bookList.map((book, index) => <BookCard key={index} book={book}/>)
            }
        </div>
    )
}