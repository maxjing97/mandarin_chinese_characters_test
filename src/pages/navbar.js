import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "../App.css"
import { useUser } from "../context/userContext";
import {auth} from "../context/auth"
import { useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';

const Navbar=()=>{
    const navigate = useNavigate();
    const [accountText, setAccountText] = useState("Login") //index of components to show
    const {userlogin} = useUser()//get user info - true if user has logged in 
    const logout = async () => {
        await signOut(auth);
        navigate("/")
    };
    //if the user is logged in, set into to 4 immediately
    useEffect(()=>{
        if (userlogin) {
            setAccountText("Account")
        } else {
            setAccountText("Login")
        }
    })

    return (    
        <div className='navBar'>
            <h1 id="title">中文 Reading Trainer</h1>
            <div className='navBar-main'>
                <div className="dropdown">
                    <h1 className="main-option"><Link to="/characters">Practice</Link></h1>
                    <div className="dropdown-content">
                        <Link to="/characters"><p>Characters</p></Link>
                        <Link to="/words"><p>Words</p></Link>
                    </div>
                </div>
                <div className="dropdown">
                    <h1 className="main-option"><Link to="/learn">Learn</Link></h1>
                    <div className="dropdown-content">
                        <Link to="/charlist"><p>Tested Characters</p></Link>
                        <Link to="/wordlist"><p>Tested Words</p></Link>
                        <Link to="/resources"><p>Dictionary</p></Link>
                    </div>
                </div>
                <div className="dropdown">
                    <h1 className="main-option"><Link to="/account">{accountText}</Link></h1>
                    {userlogin && <div className="dropdown-content">
                        <Link to="/flashcards"><p>My Flashcards</p></Link>
                        <p id="logout" onClick={logout}>Logout</p>
                    </div>}
                </div>
                <div className="dropdown">
                    <h1 className="main-option"><Link to="/about">More</Link></h1>
                    <div className="dropdown-content">
                        <Link to="/about"><p>About</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Navbar;