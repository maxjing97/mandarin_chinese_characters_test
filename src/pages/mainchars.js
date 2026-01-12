import './main.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/userContext";

const maxCat = 2429 //constant storing the highest possible character difficulty category (may change as more characters are added)
const minTest = 1 // minimum number of items to test

//this the main navigation part to select the characters
export default function Characters() {
    const navigate = useNavigate();
    const {userlogin} = useUser()//get user info - true if user has logged in 
    const [catrange, setCatrange] = useState([1, maxCat]); //sets the character range, matching default custom range selection
    const [numChars, setNumChars] = useState(10); //set text in the input box
    const [customLower, setCustomLower] = useState(1); //lower number in the range
    const [customUpper, setCustomUpper] = useState(100); //upper number in the range
    const [CharType, setCharType] = useState("Trad"); //set character type: either "Trad" or "Simp"
    const [error, setError]  = useState("") //store the error message

    //function used to handle changes in the text input box
    const handleTextChange = (e) => {
        setError("")
        setNumChars(numChars=>parseInt(e.target.value))
    };
    //handle custom range values, such that when it is clicked, it pulls values from the lower and
    const handleCustomRange = (e) => {
        const lower = document.getElementById("lower-rad");
        const upper = document.getElementById("upper-rad");
        setCatrange(catrange=>[parseInt(lower.value), parseInt(upper.value)])
    }
    //function used to handle changes in the text input box
    //function to handle custom range changes in the box
    const handleLowerChange = (e) => {
        setError("")
        setCustomLower(e.target.value)
        //change the lower value of the list
        setCatrange(catrange=>[parseInt(e.target.value), catrange[1]]) 
    };
    //function to handle custom range changes in the box
    const handleUpperChange = (e) => {
        setError("")
        setCustomUpper(e.target.value)
        setCatrange(catrange=>[catrange[0], parseInt(e.target.value)]) 
    };

    //function to handle handle final submission
    const handleSubmit = (testType) => {
        if (numChars < minTest) {
            setError(`"Number of items selected less than ${minTest}`)
        } else if (numChars > maxCat) {
            setError("Number selected to practice is too large")
        } else if (catrange[0] > catrange[1] || Math.abs(catrange[1]-catrange[0])<10 || catrange[0]<1 || catrange[1]>maxCat) {
            setError("Character range must be greater than 10 and have a valid range")
        } else if (Math.abs(catrange[1]-catrange[0])<numChars ) {
            setError("number of characters to test cannot be larger than the character range")
        } else { //if no error, we navigate to the pronunciation tester or definition checker and pass key props
            //find the test type
            const data = {
                range: catrange,
                num_test: numChars,
                character_type: CharType, //if a character is traditional or simplified : Trad or Simp
                test_type: testType, //type of information tested: prt, pwt, def
                practice_type: "characters"
            };
            //if practicing pronuciation we have a special option 
            if (testType === "prt" || testType === "pwt") {
                navigate('/practice_char_pronunciation', { state: data })
            } else {
                navigate('/practice_char_definition', { state: data })
            }
        }
    };

    return (
        <header className="page">
            <div className="container">
                <h1 className="title">Test your knowledge of Characters (字)</h1>
                <h2 className="selectCat">Select Difficulty Range (1-{maxCat}) of Characters to test</h2>
                <div className="rangebuttonContainer">
                    <div className="charbutton" onClick={() => setCatrange([1, maxCat])}> 
                        <input type="radio" name="range" id="r7"  className="charbutton" checked={catrange[0]===1 && catrange[1]===maxCat}></input>
                        <label htmlFor ="r7">All</label>
                    </div>        
                    <div className="charbutton" onClick={handleCustomRange}> 
                        <input type="radio" name="range" id="r6" className="charbutton" checked={catrange[0]===customLower && catrange[1]===customUpper}></input>
                        <label htmlFor ="r6">Custom Range: </label>
                        <input type="number" value = {customLower} onChange={handleLowerChange} className="numinput" id="lower-rad"/> to 
                        <input type="number" value = {customUpper} onChange={handleUpperChange} className="numinput" id="upper-rad"/>
                    </div>       
                    <div className="charbutton" onClick={() => setCatrange([1, 500])}> 
                        <input type="radio" name="range" id="r1" className="charbutton" checked={catrange[0]===1 && catrange[1]===500}></input>
                        <label htmlFor ="r1">1-500</label>
                    </div>
                    <div className="charbutton" onClick={() => setCatrange([500, 1000])}> 
                        <input type="radio" name="range" id="r2"  className="charbutton" checked={catrange[0]===500}></input>
                        <label htmlFor ="r2">500-1000</label>
                    </div>                    
                    <div className="charbutton" onClick={() => setCatrange([1000, 1500])}> 
                        <input type="radio" name="range" id="r3"  className="charbutton" checked={catrange[0]===1000}></input>
                        <label htmlFor ="r3">1000-1500</label>
                    </div>                  
                    <div className="charbutton" onClick={() => setCatrange([1500, 2000])}> 
                        <input type="radio" name="range" id="r4"  className="charbutton" checked={catrange[0]===1500}></input>
                        <label htmlFor ="r4">1500-2000</label>
                    </div>                                
                    <div className="charbutton" onClick={() => setCatrange([2000, maxCat])}> 
                        <input type="radio" name="range" id="r5"  className="charbutton" checked={catrange[0]===2000}></input>
                        <label htmlFor ="r5">2000+</label>
                    </div>          
                </div>

                <div id="rangeinputbox">
                    <p className="rangeinputbox-text">Test me on</p>
                    <input
                        type="number"
                        value = {numChars}
                        onChange={handleTextChange}
                        placeholder=""
                        className="textinput"
                    />
                    <p className="rangeinputbox-text">items</p>
                </div>

                <h2 className="selectCat">Select Character type</h2>
                <div className="rangebuttonContainer">
                    <div className="charbutton"  onClick={() => setCharType("Trad")}> 
                        <input type="radio" name="chartype" id="c1" className="charbutton" checked={CharType==="Trad"}></input>
                        <label htmlFor ="c1">Traditional</label>
                    </div>
                    <div className="charbutton" onClick={() => setCharType("Simp")}> 
                        <input type="radio" name="chartype" id="c2" className="charbutton" checked={CharType==="Simp"}></input>
                        <label htmlFor ="c2">Simplified</label>
                    </div>     
                </div>
                
                <h2 className="selectCat">Select Test to Take:</h2>
                <div className="selectbuttonContainer">
                    <button onClick={() =>  handleSubmit("pwt")} className="selectbutton">Pronunciation (with tones)</button>
                    <button onClick={() =>  handleSubmit("prt")} className="selectbutton">Pronunciation (without tones)</button>
                    <button onClick={() => handleSubmit("def") } className="selectbutton">Definitions</button>
                </div>
                <p id="error">{error}</p> 
                {!userlogin && 
                    <p style={{fontSize: "14pt", fontWeight: 'bold', color: "rgba(197, 0, 0, 1)"}}>You are not logged in. You need to login or create an account to save flashcards.</p>
                }
                <p>More information about the difficulty range of characters can be found by clicking on the learn page.</p>
            </div>
        </header>
    );
}
