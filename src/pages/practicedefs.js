import './practice.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
//add component to display the challenge
const maxCat = 2429 //constant storing the highest possible character difficulty category (may change as more characters are added)


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
      <td>{charJson["word/character"]}</td>
      <td>{charJson["definition"]}</td>
      <td>{charJson["full_pronunciation"]}</td>
    </tr>
  );
};
//child component 4: component to display the final results and give a list of missed results 
const Results = ({accuracies, num_test, componentJsons}) => {
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
  //randomly select numtest from the list 
  let new_random_chars = new Set()
  while (new_random_chars.size < numtest) {
    const random = retjsonlist[Math.floor(Math.random()*retjsonlist.length)] //select from our current list 
    new_random_chars.add(random)
  }
  new_random_chars = Array.from(new_random_chars) //convert to list
  return new_random_chars 
}

//function to get the definition components. Get a list of the character jsons, list of lists of definitions, and the list of the correct defintion it
function getComponents(bottom, top , num_test, character_type, test_type, practice_type) { 
  const componentsList = [];
  const correctvals = [];
  const jsonlist = getJsons(bottom, top,num_test,practice_type, character_type)//get the proper list of subjson
  //iterate to create components
  //based on the test type: isolate the key for the correct value to test the user on
  let test_key = "test_definition" //we are testing the defnition
  let supporting ="full_pronunciation" //get the supporting text key to help the user: either definition or the pronuciation

  const defslist = [] //get a list of definition json to show
  const defidx = [0,1,2,3,4] //index of the 5 definitions to show
  for (const json of jsonlist) {
    const def_dict = {}//get a dictionary mapping definitions to certain keys
    const currdef = json[test_key]//current definition
    const rlist = getJsons(0,maxCat,4,practice_type, character_type) //get random 4 other definitions in a list format using the same get jsons list, selecting from all possible difficutly categories
    const rCorrectKey = defidx[Math.floor(Math.random() * defidx.length)]//randomly select the correct definition index key 
    def_dict[String(rCorrectKey)] = currdef//add the correct key to the dictiontary
    let j = 0 //count index of the random json list of 4 elements 
    for(const i of defidx) {
      if(i !== rCorrectKey) { //only if it is not 
        def_dict[String(i)] = rlist[j][test_key] //dict keys must be strings
        j++ //increment only when the correct key has not pass
      }
    }//iterrate through the non-correct definitions set difference to create a def list
    componentsList.push(<TextDisplay char={json["word/character"]} sup={json[supporting]}/>)
    componentsList.push(<DefinitionPart char={json["word/character"]} definition={currdef} full_pronunciation={json["full_pronunciation"]}/>)
    correctvals.push(currdef)
    defslist.push(def_dict)
  }

  return [componentsList, correctvals, jsonlist, defslist]
}

export default function PracticeDefinition(props) { //main parent image component (to avoid remounts when changing child components shown)

  const navigate = useNavigate();
  const location = useLocation();
  const { range, num_test, character_type, test_type, practice_type} = location.state 
  //get destructured data
  const [componentList, setComponentList] = useState([])//store the fixed list of components 
  const [correctList, setCorrectList] = useState([])//store the fixed list of correct values (definitions)
  const [correctJsons, setCorrectJsons] = useState([])//store the fixed list json objects containing full information for the characters 
  const [defJsons, setDefJsons] = useState([{"0":"", "1":"","2":"","3":"","4":""}]) //list of definition jsons to show. initialize to prevent invalid issues
  
  const [index, setIndex] = useState(0); //this index is key, cycling through through all words (60 for now 2 for ach)
  const [isText, setIsText] = useState(0); //states if we are on the definition part or not 
  const [correctmessage, setCorrectMessage]  = useState("") //store the correct message
  const [accuracies, setAccuracies] = useState([])//array for accuracies
  const inputRef = useRef(null); //use to focus cursor. UseRef hooks create object that lasts through renders, and modifying does not trigger a re-render
  
  // This effect will only run once after the component mounts. user this to get the necessary data
  useEffect(() => { //runs after initial render
    const [componentList, correctVals, correctJsons, defslist] = getComponents(range[0], range[1], num_test, character_type, test_type, practice_type) //pass range as a shallow object
    setComponentList(componentList)
    setCorrectList(correctVals)
    setCorrectJsons(correctJsons) //add empty json at the end to prevent unexpected rendering errors 
    setDefJsons(defslist)   
  }, []); 

  
  const nextSection = (gap, accuracy_list = accuracies) => { //argument is how much to change the index can be 1 or 2 (when we want to skip the current text)
    //if isText is 0, this is an image one, so we move to a text one (so we stay on the same word)
    if (gap === 1) {
      if (isText === 0 && index < (componentList.length-1)) {
        setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
        setIsText(1); //move to the text section 
      } else if (isText === 1 && index < (componentList.length-1)) { //in this case, the user has skipped the section, so record the accuracy as 0 for this, while moving on to the next image to test
        setIsText(0); //move to the character section 
        setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
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

  //function used to handle changes in the text input box
  const handleSelection = (num) => {
    const i = Math.floor(index/2)//get true relative index
    if (defJsons[i][num] === correctList[i]) { //check if selected the selected definition matches
      setAccuracies(curr=>[...curr, 1]) //increment the accuracy
      setCorrectMessage("Last Response Correct") //if correct

      nextSection(2, [...accuracies, 1]) //more to the next one
    } else{
      //when incorrect, we add to the of components and correct words to repeat (afterwards) (only when index is even, meaning on input section)
      if (index % 2 ===0 ) {
        setComponentList(curr=>[...curr, curr[index], curr[index+1]])
        setCorrectList(curr=>[...curr, curr[index/2]])   
        setAccuracies(curr=>[...curr, 0])
        setDefJsons(curr=>[...curr, curr[Math.floor(index/2)]])
      }
      setCorrectMessage("Incorrect Definition entered, try again later")
      nextSection(1) 
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

  const handleSubmit = (e) => {
    setCorrectMessage("Last Response Incorrect")
    nextSection(1) 
  }

  return (
    <div className="all">
      <button onClick={menuExit} className="back">
      ⬅ Back to Menu
      </button>
      <h3>Select the correct definition for the character</h3>

      <div className="text_container">
        {/* render all components with varying visiblity to avoid unmounting, destroying vital state variables. Renders components in order*/}
        {componentList.map((Component, i) => (
          <div key={i} style={{ display: index === (i) ? 'block' : 'none' }}>
            {Component}
          </div>
        ))}

        {/* button for selecting defintiion only if is text is false*/}
        
        <div style={{ display: (isText === 0) ? 'block' : 'none' }}>
          <div id="definition_select" >
          <button onClick={() =>  handleSelection("0")} className="selectbutton">{defJsons[Math.floor(index/2)]["0"]}</button>
          <button onClick={() =>  handleSelection("1")} className="selectbutton">{defJsons[Math.floor(index/2)]["1"]}</button>
          <button onClick={() =>  handleSelection("2")} className="selectbutton">{defJsons[Math.floor(index/2)]["2"]}</button>
          <button onClick={() =>  handleSelection("3")} className="selectbutton">{defJsons[Math.floor(index/2)]["3"]}</button>
          <button onClick={() =>  handleSelection("4")} className="selectbutton">{defJsons[Math.floor(index/2)]["4"]}</button>
          </div>
        </div>
        <div id="def_buttons">
          <p style={{display: componentList.length !== 1 ? 'block' : 'none' }}>
          {(Math.floor(index/2) < num_test) ? `Word ${Math.floor(index/2)} of ${num_test} total`: 
          `Repeating missed characters`}</p> 
          <p style={{...styles.correct_text, ...{backgroundColor : (correctmessage==="Last Response Correct" ? "#44e02f":"#e63946")}}}>{correctmessage}</p> 
        </div>
        <button className="back" style={{...styles.next_button, ...{display : (index % 2===1 ? "block":"none")}}} onClick={handleSubmit}>Try the Next Word ➡</button>
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
    margin: "0 auto",
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
  }
};
