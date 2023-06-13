import "./BookCard.css"

export function BookCard(props: { book: any }) {
    return (
        <div className="bookcard">
            <img src={props.book.volumeInfo.imageLinks?.thumbnail} alt="" />
            <div>
                <p>{props.book.volumeInfo.title}</p>
                <p>{props.book.volumeInfo.authors}</p>
            </div>
            <div>
                <button>I own this</button>
                <button>I want this</button>
            </div>

        </div>
    )
}