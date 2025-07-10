import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "../App.css"
import { useUser } from "../context/userContext";

const Navbar=()=>{
    const [accountText, setAccountText] = useState("❌") //index of components to show
    const {userlogin} = useUser()//get user info 
    //if the user is logged in, set into to 4 immediately
    useEffect(()=>{
        if (userlogin) {
            setAccountText("Account ✅")
        } else {
            setAccountText("Account ❌")
        }
    })
    //check if logged in, change account text
    useUser()

    return (    
        <div className='navBar'>
            <h1 id="title">中文 Reading Trainer</h1>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/characters">Practice</Link></h1>
                <div className="dropdown-content">
                    <Link to="/characters">Characters</Link>
                    <Link to="/words">Words</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/learn">Learn</Link></h1>
                <div className="dropdown-content">
                    <Link to="/charlist">Tested Characters</Link>
                    <Link to="/wordlist">Tested Words</Link>
                    <Link to="/resources">More Resources</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/about">More</Link></h1>
                <div className="dropdown-content">
                    <Link to="/about">About</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/">{accountText}</Link></h1>
            </div>
        </div>
    )

}

export default Navbar;