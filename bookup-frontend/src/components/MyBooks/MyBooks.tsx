import { Link } from "react-router-dom";
import { Buser } from "../../models/User";
import { useEffect, useState } from "react";
import { getBook } from "../../services/bookSearchService/bookSearchService";
import "./MyBooks.css";
import { Header } from "../Header/Header";
import { BookCard } from "../BookCard/BookCard";

export function MyBooks(props: {currentUser: Buser}) {

    const [userBookList, setUserBookList] = useState<any[]>([]);
    const [showBtnPopUp, setShowBtnPopUp] = useState(false);
    const [showBook, setShowBook] = useState<any>({});
    const [isbn, setIsbn] = useState("");
    
    async function getUserBookList( bUser: Buser ) {
        let bArray: any[] = [];

        for (let book of bUser.books) {                
            await getBook(book).then( book => bArray = [ ...bArray , ...book.data.items ])
            setUserBookList(bArray);            
        }
    }

    useEffect(() => {        
        console.log("useEffect");
        getUserBookList(props.currentUser);        
    },[props.currentUser]);


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
        }
    }

    function showBookLocation(bIsbn: string) {
        console.log("showBookLocation");
    }

    function addBook(bIsbn: string) {
        console.log("addBook");
    }    
    
  
    return (
        <div>
            <Header></Header>            
            <div className="main-mybooks">
                <h2 className="hdr-mybooks">My Books</h2>
                <div className="mybooks">
                    {
                    userBookList.map( (book ,index) => 
                    <div className="book" key={book.id}>
                        <button className={!showBtnPopUp?"btn-showpopup":"btn-noshowpopup"} key={index} onClick={() => handleShowBtnPopUp(book)}>
                            <img  className="book-image" src={book.volumeInfo.imageLinks?.thumbnail!} alt="" />
                        </button>                                         
                        <address><b>Author/s:</b> {book.volumeInfo.authors}</address>
                        <p><b>ISBN:</b> {book.volumeInfo.industryIdentifiers[0].type === "ISBN_13" ? book.volumeInfo.industryIdentifiers[0].identifier: book.volumeInfo.industryIdentifiers[1].identifier}</p>
                    </div>)
                    }
                </div>
                <BookCard book={showBook} viewOnly={true} user={props.currentUser} showBtnPopUp={showBtnPopUp} onClose={handleHideBtnPopUp} showBookLocation={(isbn) => showBookLocation(isbn)} addBook={(isbn) => addBook(isbn)} isbn={() => setIsbn(isbn)} />
            </div>
        </div>
    )
}