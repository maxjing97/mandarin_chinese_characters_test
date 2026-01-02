import './practice.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { PracticeAddDeck } from './flashcards';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../context/userContext";

import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
//add component to display the challenge

//child component 1: display Text
const TextDisplay = ({ char, sup}) => {
  return (
    <div className="img_container">
      <h1 className="main_text">{char}</h1>
      <p>Hint: {sup}</p>
    </div>
  );
};

//child component 2: display definitions and informations after a user submits
const DefinitionPart = ({char, definition, full_pronunciation}) => {
  return (
    <div>
      <p>Please review the information</p>
      <h1 className="def_text">{char}</h1>
      <p>Pronunciation: <strong>{full_pronunciation}</strong></p> 
      <p>Definition: {definition}</p>
    </div>
  );
};
//child component 3: component to display details of a character in a table format 
const DetailsRow = ({charJson}) => {
  return (
    <tr>
      <td>{getdisplaystring(charJson)}</td>
      <td>{charJson["definition"]}</td>
      <td>{charJson["full_pronunciation"]}</td>
    </tr>
  );
};
//child component 4: component to display the final results and give a list of missed results 
const Results = ({accuracies, num_test, componentJsons}) => {
  const {userlogin} = useUser()//get user info - true if user has logged in 
  const ourAccuracy = accuracies.slice(0,num_test)//narrowed down list of accuracy on the first attempt only
  const accuracy = ourAccuracy.reduce((a,b)=>a+b,0) //compute accuracy on the first few num_test elements

  //create table header
  const compList = [] //json list to display
  for(let i=0; i<num_test; i++ ) {
    //if accuarcy is low, we add to the list of components
    if (accuracies[i] === 0) {
      const currentJson = componentJsons[i]
      compList.push(currentJson)
    }
  }

  useEffect(()=>{
    return () => {} 
  }, []) //call only once on mount
  //if display components if they correpond to a one missed and are a defintion component
  return (
    <div className='results-display'>
      <h2>Results Page</h2>
      <p>First-time Accuracy {accuracy/num_test*100}% or {accuracy}/{num_test} correct</p>
      <p>Missed Characters (if any)</p>
      <table style={{ display: compList.length > 0 ? 'block' : 'none' }}>
        <tr><th>word/character</th><th>definition</th><th>full pronunciation</th></tr>
        {compList.map((Json, i) => (
          <DetailsRow charJson={Json}/>
        ))}
      </table>
      {userlogin &&
      <div>
        <p>Save your missed characters to a flashcard deck!</p>
        <PracticeAddDeck dataType={"characters"} mainjson={compList}/>
      </div>
      }
    </div>
  );
};

function getJsons(bottom, top, numtest,practice_type, character_type) {
  //get load in jsondata of can characters based on character type and practice type
  let jsonData = null 
  let retjsonlist = []
  if(practice_type === "characters" && character_type === "Trad") {
    jsonData = tradchar
  } else if (practice_type === "characters" && character_type === "Simp") {
    jsonData = simpchar
  }
  //first get all json matching the category range 
  for (const key in jsonData) {
    const json = jsonData[key] //get json list
    if(json["cat"]<= top && json["cat"] >= bottom ) { //narrow down by category (in range) and add to the final list 
      retjsonlist.push(json)
    }
  }
  //select numtest unique json objects from this
  //randomly select numtest from the list 
  let new_random_chars = new Set()
  while (new_random_chars.size < numtest) {
    const random = retjsonlist[Math.floor(Math.random()*retjsonlist.length)] //select from our current list 
    new_random_chars.add(random)
  }
  new_random_chars = Array.from(new_random_chars) //convert to list
  return new_random_chars 
}

//handle cases of alternative character
//set the display character (handle cases of alt characters)
const getdisplaystring =(charJson)=>{
  if(!charJson["alt"] || charJson["alt"].length===0){ //if no alt or null (check null first)
    return charJson["word/character"]
  } else {
    const v1 = charJson["word/character"]
    const v2 = charJson["alt"]
    return `${v1} or ${v2}`
  }
} 

//function to get the pronunciation components, and the list of correct values 
//range is a list of highest to 
function getComponents(bottom, top , num_test, character_type, test_type, practice_type) { 
  const componentsList = [];
  const correctvals = [];
  const jsonlist = getJsons(bottom, top,num_test,practice_type, character_type)//get the proper list of subjson
  //iterate to create components
  //based on the test type: isolate the key for the correct value to test the user on
  let test_key = ""
  if (test_type === "prt") {//testing without tones
    test_key = "full_pronunciation_wo"
  } else if (test_type === "pwt") { //testing with tones 
    test_key = "full_pronunciation"
  }
  let supporting ="test_definition" //get the supporting text key to help the user: either definition or the pronuciation

  for (const json of jsonlist) {
    componentsList.push(<TextDisplay char={getdisplaystring(json)} sup={json[supporting]}/>)
    componentsList.push(<DefinitionPart char={getdisplaystring(json)} definition={json["definition"]} full_pronunciation={json["full_pronunciation"]}/>)
    correctvals.push(json[test_key])
  }

  return [componentsList, correctvals, jsonlist]
}

export default function PracticeCharPronunciation(props) { //main parent image component (to avoid remounts when changing child components shown)
  
  const navigate = useNavigate();
  const location = useLocation();
  //get destructured data
  const { range, num_test, character_type, test_type, practice_type} = location.state 
  
  const [componentList, setComponentList] = useState([])//store the fixed list of components 
  const [correctList, setCorrectList] = useState([])//store the fixed list of correct values 
  const [correctJsons, setCorrectJsons] = useState([])//store the fixed list json objects containing full information for the characters 
  const [index, setIndex] = useState(0); //this index is key, cycling through through all words (60 for now 2 for ach)
  const [isText, setIsText] = useState(0); //states if we are on the definition part or not 
  const [text, setText] = useState(""); //set text in the input box
  const [nextText, setnextText] = useState("Submit");//text to display in the next button
  const [correctmessage, setCorrectMessage]  = useState("Type the correct pronunciation") //store the correct message
  const [accuracies, setAccuracies] = useState([])//array for accuracies

  const inputRef = useRef(null); //use to focus cursor. UseRef hooks create object that lasts through renders, and modifying does not trigger a re-render
  
  // This effect will only run once after the component mounts. user this to get the necessary data
  useEffect(() => {
    const [componentList, correctVals, correctJsons] = getComponents(range[0], range[1], num_test, character_type, test_type, practice_type) //pass range as a shallow object
    setComponentList(componentList)
    setCorrectList(correctVals)
    setCorrectJsons(correctJsons)
  }, []); 

  //parse pronunciations string into a list with correct formatting
  const parsePronunciations =(pro) => {
    const prolist = []
    let myArray = ""
    if (pro) {//if is a string
      myArray = pro.split("/") //split based on / 
    }
    for(const str of myArray) {
      prolist.push(str.trim().toLowerCase())
    }
    return prolist
  }


  const nextSection = (gap, accuracy_list = accuracies) => { //argument is how much to change the index can be 1 or 2 (when we want to skip the current text)
    //if isText is 0, this is an image one, so we move to a text one (so we stay on the same word)
    if (gap === 1) {
      if (isText === 0 && index < (componentList.length-1)) {
        setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
        setIsText(1); //move to the text section 
        setnextText("Try the Next Word ➡")
      } else if (isText === 1 && index < (componentList.length-1)) { //in this case, the user has skipped the section, so record the accuracy as 0 for this, while moving on to the next image to test
        setIsText(0); //move to the character section 
        setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
        setnextText("Submit")//set the appropriate text for the button
        setText("")//when the skip button is clicked, reset the value of the text input box
        //update component list to the next index since state changes in React do not apply immediately, being applied by the next render cycle
      } else {
        //when we have reached the end, only display the results page: reset component list, and send the data, calculating accuracies
        setIndex(0);
        setIsText(1);
        setCorrectMessage("") //clear mesage at the end
        setComponentList([<Results accuracies={accuracy_list} num_test={num_test} componentJsons={correctJsons}/>])
      }
    } else if (gap === 2) { //if gap is two, we keep the same pattern
      if (index < (componentList.length-2)) {
        setIndex((prev) => (prev + 2)); //go to the next one as long as the end has not been reached
      } else {
        //when we have reached the end, only display the results page: reset component list, and send the data, calculating accuracies
        setIndex(0);
        setIsText(1);
        setCorrectMessage("") //clear mesage at the end
        setComponentList([<Results accuracies={accuracy_list} num_test={num_test} componentJsons={correctJsons}/>])
      }
    }
  }
  //handle the submission button
  const handleSubmit = (e) => {
    const targetWord = correctList[index/2] //get the correct target word
    if (text && parsePronunciations(targetWord).includes(text.trim().toLowerCase())) { //if matching and string is valid
      setText("") //reset if there is match
      setAccuracies(curr=>[...curr, 1])
      setCorrectMessage("Last Response Correct")
      nextSection(2, [...accuracies, 1]) //more to the next on the next one (pass the updated list before the state rerender to avoid unexpected issues )
    } else{
      //when incorrect, we add to the of components and correct words to repeat (afterwards) (only when index is even)
      if (index % 2 ===0 ) {
        setComponentList(curr=>[...curr, curr[index], curr[index+1]])
        setCorrectList(curr=>[...curr, curr[index/2]])   
        setAccuracies(curr=>[...curr, 0])
      }
      setCorrectMessage("Incorrect Pronunciation entered, try again later")
      nextSection(1) 
    }
  }

  //function used to handle changes in the text input box
  const handleTextChange = (e) => {
    setText(e.target.value) //set the text value dynamically
    const value = e.target.value;
    const targetWord = correctList[index/2] //get the correct value for based on the index
    if (parsePronunciations(targetWord).includes(value.trim().toLowerCase())) {
      setText("") //reset if there is match
      setAccuracies(curr=>[...curr, 1]) //increment the accuracy
      setCorrectMessage("Last Response Correct") //if correct

      nextSection(2, [...accuracies, 1]) //more to the next one
    }
  };

  //function to handle exist to menu
  const menuExit = (e) =>{
    //in the case, we are not at the results page, show a warning window before exiting to menu
    const confirmed = window.confirm("Are you sure you want to proceed?"); //confirm for this case as a precaution to avoid exiting to menu
    if (confirmed) {
      navigate('/characters') //exist back to characters
    } 
  }

  //function for the special tone keyboard
  function applyPinyinTone(num) {
    const toneMap = {
      a: ['ā', 'á', 'ǎ', 'à'],
      o: ['ō', 'ó', 'ǒ', 'ò'],
      e: ['ē', 'é', 'ě', 'è'],
      i: ['ī', 'í', 'ǐ', 'ì'],
      u: ['ū', 'ú', 'ǔ', 'ù'],
      ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
    };
    const letters = new Set(["a","o","e","i","u","ü"])
    const currstr = text //get text string of  
    //for the special case that the ü key is pressed
    if (num === 100) {
      //get new string 
      const newstr = currstr.slice(0, currstr.length-1) + "ü" 
      setText(newstr)
    } else if (text.length === 0) { //if the text is empty, no modifciation
      return 
    } else {
      const lastlet = text[currstr.length-1] //check if the last letter is in the list
      if(letters.has(lastlet)) { //if the letter is in the set
        //get new string based on map
        const newstr = currstr.slice(0, currstr.length-1) + toneMap[lastlet][num]
        setText(newstr)
        return  
      }
    }

    return 
  }
  return (
    <div className="all">
      <button onClick={menuExit} className="back-menu">
      ⬅ Back to Menu
      </button>
      <h3>Try to type the pronuciation ({test_type === "prt"? "without": "with"} tone) for {num_test} characters</h3>

      <div className="text_container">
        {/* render all components with varying visiblity to avoid unmounting, destroying vital state variables. Renders components in order*/}
        {componentList.map((Component, i) => (
          <div key={i} style={{ display: index === (i) ? 'block' : 'none' }}>
            {Component}
          </div>
        ))}

        {/*button for selecting defintiion only if is text is false*/}
        
        <div style={{ display: (isText === 0) ? 'block' : 'none' }}>
          <div className="text_wrapper">
            <input
              type="text"
              value = {text}
              ref={inputRef}
              id= "char_text_input"
              onChange={handleTextChange}
              placeholder="Start typing..."
            />
          </div>
        </div>
        <p style={{display: componentList.length !== 1 ? 'block' : 'none' }}>
        {(Math.floor(index/2) < num_test) ? `Word ${Math.floor(index/2)} of ${num_test} total`: 
        `Repeating missed characters`}</p> 
      </div>
      
      <button onClick={handleSubmit} style={{...styles.skip, ...{display: componentList.length !== 1 ? 'block' : 'none' }}}>{nextText}</button> {/* skip function inherted from parent component (display only the number of components is not 0)*/}
      
      <p style={{...styles.correct_text, ...{backgroundColor : (correctmessage==="Last Response Correct" ? "#44e02f":"#e63946")}}}>{correctmessage}</p> 

      {/*only display tone keyboard for*/}
      <div style={{display : test_type === "pwt" ? 'block' : 'none'}}> 
        <div className='tone_buttons'>
          <button onClick={() =>  applyPinyinTone(0)} className="selecttone">◌̄(1)</button>
          <button onClick={() =>  applyPinyinTone(1)} className="selecttone">◌́(2)</button>
          <button onClick={() =>  applyPinyinTone(2)} className="selecttone">◌̌(3)</button>
          <button onClick={() =>  applyPinyinTone(3)} className="selecttone">◌̀(4)</button>
          <button onClick={() => applyPinyinTone(100) } className="selecttone">ü</button>
        </div>
        <p>Tone/Special Letter Keyboard</p>
      </div>
    </div>
  );
};

//addition styles for a component that needs to chnage style often, like the skip button
let styles = {
  correct_text: {
    color: "black",
    fontSize: "14pt",
    display: "flex",
    margin: "10 auto",
    padding: "10px",
    justifyContent: "center",
    borderRadius: '12px',
    placeItems: "center",
  }, 
  skip: {
    backgroundColor: '#44e02f',     // vibrant green
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  }, 
};
