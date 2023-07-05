import { BookCard } from "../BookCard/BookCard";
import "./BookList.css"
import { BookMap } from "../BookMap/BookMap";
import { useEffect, useState } from "react";
import { Buser } from "../../models/User";
import { getUserByIsbn, getUsers, updateUser } from '../../services/userService/userService';

export function BookList(props: {bookList: any[], user:Buser, chatUser: (chatUser: Buser) => void , chatUserIsbn: (chatUserIsbn: string) => void}) {

    const [showBtnPopUp, setShowBtnPopUp] = useState(false);
    const [showBook, setShowBook] = useState<any>({});
    const [showMap, setShowMap] = useState(false);
    const [isbn, setIsbn] = useState("");
    const [isbnUsers, setIsbnUsers] = useState<Buser[]>([]);
    
    let userBooks = Object.assign(props.user.books);

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

    //finds all users that are not me
  async function getOtherUsers(isbn: string){
    console.log(JSON.stringify(props.user))
    let allUsers = await getUserByIsbn(isbn);
    
    console.log("hello: " + JSON.stringify(allUsers));
    
    //let otherUsers = allUsers.filter( u => u.email !== props.user.email);
    //console.log(otherUsers)
    //allUsers.filter( u => u.books.includes(isbn));
    return allUsers
  }

    const showBookLocation = async (isbn: string) => {
        if(isbn != "") {
            let isbnUsers = await getOtherUsers(isbn);
            setIsbnUsers(isbnUsers);
        }
        setShowMap(!showMap);
         props.chatUserIsbn(isbn);
    }

    function addBook(newIsbn:string) {  
        console.log("isbn " +  newIsbn);
        userBooks.push(newIsbn);
            
        const buser = { "_id" : props.user._id,
                        "uid" : props.user.uid,
                        "email": props.user.email,
                        "zipcode" : props.user.zipcode,
                        "books" : userBooks };
        console.log(buser);
        updateUser(buser, props.user._id!);        
    }

    useEffect ( () => {
        console.log("showPopUp" +  showBtnPopUp);        
    },[showBtnPopUp])
     
    let mapCon = showMap ?  <BookMap user={props.user} closeMap={(isbn) => showBookLocation(isbn)} isbnUsers={isbnUsers} chatUser={chatUser => props.chatUser(chatUser)} chatUserIsbn={isbn}></BookMap> : "";

    return (
       <div> 
    
            {mapCon}
            <div className="booklist">
            {
                props.bookList.map((book, index) => 
                    (   
                        <div className="bookcard">
                            {
                                book.volumeInfo.imageLinks?.thumbnail ? <button key={index} onClick={() => handleShowBtnPopUp(book)} className="book-btn"><img className="book-image" src={book.volumeInfo.imageLinks?.thumbnail} alt="" /></button>
                                : <button key={index} onClick={() => handleShowBtnPopUp(book)} className="book-btn"><p className="no-book-image">{book.volumeInfo.title}</p></button>
                            }
                            
                            {/* <button key={index} onClick={() => handleShowBtnPopUp(book)} className="book-btn"><img className="book-image" src={book.volumeInfo.imageLinks?.thumbnail} alt="" /></button> */}                           
                            
                        </div>
                    )
                )           

            }
            </div>
            <BookCard book={showBook} user={props.user} showBtnPopUp={showBtnPopUp} onClose={handleHideBtnPopUp} showBookLocation={(isbn) => showBookLocation(isbn)} addBook={(isbn) => addBook(isbn)} isbn={() => setIsbn(isbn)}/>
        </div>
    )
}