import React from 'react';
import {Link} from 'react-router-dom';
import "../App.css"


const Navbar=()=>{
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
                <h1 className="main-option"><Link className="main-option" to="/learn">Learn</Link></h1>
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
        </div>
    )

}

export default Navbar;