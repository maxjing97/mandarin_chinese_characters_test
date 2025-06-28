import './main.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const maxCat = 2429 //constant storing the highest possible character difficulty category (may change as more characters are added)

//this the main navigation part to select the characters
export default function Characters() {
    const navigate = useNavigate();
    const [catrange, setCatrange] = useState([1, 100]); //sets the character range, matching default custom range selection
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
        //convert to integer 
        console.log(numChars)
        console.log(catrange)
        if (numChars < 10) {
            setError("Number of Characters selected less than 10")
        } else if (numChars > maxCat) {
            setError("Number of Characters selected too large")
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
        <div className="page">
            <h1 className="title">Test your knowledge of Characters (字)</h1>
            <div className="container">
                <h2 className="selectCat">Select Difficulty Range (1-{maxCat}) of Characters to test</h2>
                <div className="rangebuttonContainer">
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r1" onClick={() => setCatrange([1, 500])} className="charbutton"></input>
                        <label htmlFor ="r1">Beginner: (1-500)</label>
                    </div>
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r2" onClick={() => setCatrange([500, 1000])} className="charbutton"></input>
                        <label htmlFor ="r2">Advanced Begineer: (500-1000)</label>
                    </div>                    
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r3" onClick={() => setCatrange([1000, 1500])} className="charbutton"></input>
                        <label htmlFor ="r3">Intermediate: (1000-1500)</label>
                    </div>                  
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r4" onClick={() => setCatrange([1500, 2000])} className="charbutton"></input>
                        <label htmlFor ="r4">Intermediate+: (1500-2000)</label>
                    </div>                                
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r5" onClick={() => setCatrange([2000, maxCat])} className="charbutton"></input>
                        <label htmlFor ="r5">Advanced: (2000+)</label>
                    </div>        
                    <div className="charbutton"> 
                        <input type="radio" name="range" id="r6" className="charbutton" onClick={handleCustomRange}></input>
                        <label htmlFor ="r6">Custom Range: </label>
                        <input type="number" value = {customLower} onChange={handleLowerChange} className="numinput" id="lower-rad"/> to 
                        <input type="number" value = {customUpper} onChange={handleUpperChange} className="numinput" id="upper-rad"/>
                    </div>        
                </div>

                <div id="rangeinputbox">
                    <p className="selectCat"># to test:</p>
                    <input
                        type="number"
                        value = {numChars}
                        onChange={handleTextChange}
                        placeholder=""
                        className="textinput"
                    />
                </div>

                <h2 className="selectCat">Select Character type</h2>
                <div className="rangebuttonContainer">
                    <div className="charbutton"> 
                        <input type="radio" name="chartype" id="c1" onClick={() => setCharType("Trad")} className="charbutton"></input>
                        <label htmlFor ="c1">Traditional</label>
                    </div>
                    <div className="charbutton"> 
                        <input type="radio" name="chartype" id="c2" onClick={() => setCharType("Simp")} className="charbutton"></input>
                        <label htmlFor ="c2">Simplified</label>
                    </div>     
                </div>
                
                <h2 className="selectCat">Select Test to Take:</h2>
                <div className="selectbuttonContainer">
                    <button onClick={() =>  handleSubmit("prt")} className="selectbutton">Pronunciation without tones</button>
                    <button onClick={() =>  handleSubmit("pwt")} className="selectbutton">Pronunciation with tones</button>
                    <button onClick={() => handleSubmit("def") } className="selectbutton">Definitions</button>
                </div>
                <p id="error">{error}</p> 
                <p>more information about the difficulty range of characters can be found on the learn page</p>
            </div>
        </div>
    );
}
