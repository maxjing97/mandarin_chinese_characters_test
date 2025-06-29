import React from 'react';
import {Link} from 'react-router-dom';
import "../App.css"


const Navbar=()=>{
    return (    
        <div className='navBar'>
            <h1 id="title">中文 Reading Trainer</h1>
            <div className="dropdown">
                <h1 className="main-option">Practice</h1>
                <div className="dropdown-content">
                    <Link to="/characters">Characters</Link>
                    <Link to="/words">Words</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option">Learn</h1>
                <div className="dropdown-content">
                    <Link to="/charlist">Characters+ List</Link>
                    <Link to="/wordlist">Words List</Link>
                </div>
            </div>
            <div className="dropdown">
                <h1 className="main-option"><Link to="/resources">More</Link></h1>
                <div className="dropdown-content">
                    <Link to="/resources">More Resources</Link>
                    <Link to="/about">About</Link>
                </div>
            </div>
        </div>
    )

}

export default Navbar;