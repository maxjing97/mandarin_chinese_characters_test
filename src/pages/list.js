import './main.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
import tradword from './data/tradwords.json'; //import json fo 
import simpword from './data/simpwords.json'; //import json 

const CharDetailsRow = ({charJson, index}) => { //current table row format displaying 
  //set the display character (handle cases of alt characters)
  const getdisplaystring =(charJson)=>{
    if(charJson["alt"].length===0){ //if no alt 
      return charJson["word/character"]
    } else {
      const v1 = charJson["word/character"]
      const v2 = charJson["alt"]
      return `${v1} or ${v2}`
    }
  } 
  return (
    <tr>
      <td>{index}</td>
      <td>{getdisplaystring(charJson)}</td>
      <td>{charJson["definition"]}</td>
      <td>{charJson["full_pronunciation"]}</td>
      <td>{charJson["cat"]}</td>
    </tr>
  );
};
const DefDetailsRow = ({charJson, index}) => {
  
  return (
    <tr>
      <td>{index}</td>
      <td>{charJson["word/character"]}</td>
      <td>{charJson["definition"]}</td>
      <td>{charJson["full_pronunciation"]}</td>
      <td>{charJson["cat"]}</td>
    </tr>
  );
};


//simplified function to get all jsons for the 4 possible categories
function getJsons(character_type, list_type) {
  //get load in jsondata of can characters based on character type and practice type
  let jsonData = null 
  let retjsonlist = []
  if(list_type === "characters" && character_type === "Trad") {
    jsonData = tradchar
  } else if (list_type === "characters" && character_type === "Simp") {
    jsonData = simpchar
  } else if(list_type === "words" && character_type === "Trad") {
    jsonData = tradword
  } else if (list_type === "words" && character_type === "Simp") {
    jsonData = simpword
  }
  //first get all json matching the category range 
  for (const key in jsonData) {
    const json = jsonData[key] //get json list
    retjsonlist.push(json)
  }
  return retjsonlist 
}

//component to display the list of characters
export function CharList () {
  const navigate = useNavigate();
  const [charType, setCharType] = useState("Trad") //set character type
  const [displayJson, setDisplayJson] = useState([]) //jsons to display (depends on the options chosen)
  //run after each mount only
  useEffect(() => {
    const jsons = getJsons(charType, "characters")//get jsons
    setDisplayJson(jsons)
  }, [])
  //handle clicking submit for a character type
  const handleClick = (newCharType) => {
    setCharType(newCharType)
    const jsons = getJsons(newCharType, "characters")//get jsons
    setDisplayJson(jsons)
  }
  //handle back button 
  const handleBack= () => {
    setDisplayJson([])
    navigate("/learn")
  }
  
  //if display components if they correpond to a one missed and are a defintion component
  return (
    <div id='characters-list'>
      <div className='charlist_start'>
      <button onClick={handleBack}className="back_to_learn">⏴ Learning Menu</button>
      <h2>Character List</h2>
      <p>This is the list of characters (with various pronunciations) tested in the practice characters section</p>
      <p>(Also includes words where one of the characters is unique in the list)</p>
        
        <div className="charbuttonContainer">
            <h2 className="selectCat">Select Character type: </h2>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c1" onClick={() => handleClick("Trad")} className="charbutton" checked={charType === 'Trad'}></input>
                <label htmlFor ="c1">Traditional</label>
            </div>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c2" onClick={() => handleClick("Simp")} className="charbutton"></input>
                <label htmlFor ="c2">Simplified</label>
            </div>     
        </div>
      </div>
      <table class="char_table">
        <tr><th>Count</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr>
        {displayJson.map((Json, i) => (
          <CharDetailsRow charJson={Json} index={i+1}/>
        ))}
      </table>
    </div>
  );
};

//component to display the list of words of multiple characters
export function WordList () {
  const navigate = useNavigate();
  const [displayJson, setDisplayJson] = useState([]) //jsons to display (depends on the options chosen)
  const [charType, setCharType] = useState("Trad") //set character type

  //run after each mount only
  useEffect(() => {
    const jsons = getJsons(charType, "words")//get jsons
    setDisplayJson(jsons)
  }, [])
  //handle clicking submit for a character type
  const handleClick = (newCharType) => {
    setCharType(newCharType)
    const jsons = getJsons(newCharType, "words")//get jsons
    setDisplayJson(jsons)
  }
  //handle back button 
  const handleBack= () => {
    setDisplayJson([])
    navigate("/learn")
  }
  //handle clicking submit

  //if display components if they correpond to a one missed and are a defintion component
  return (
    <div id='characters-list'>
      <div className='charlist_start'>
      <button onClick={handleBack}className="back_to_learn">⏴ Learning Menu</button>
      <h2>Multi-character Word List</h2>
      <p>This is the list of words formed from multiple characters tested in the practice word section</p>
      <p>(Also includes words where one of the characters is unique in the list)</p>
        <div className="charbuttonContainer">
            <h2 className="selectCat">Select Character type: </h2>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c1" onClick={() => handleClick("Trad")} className="charbutton" checked={charType === 'Trad'}></input>
                <label htmlFor ="c1">Traditional</label>
            </div>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c2" onClick={() => handleClick("Simp")} className="charbutton"></input>
                <label htmlFor ="c2">Simplified</label>
            </div>     
        </div>
      </div>
      <table>
        <thead><tr><th>Count</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
        <tbody>{displayJson.map((Json, i) => (
          <DefDetailsRow charJson={Json} index={i+1}/>
        ))}</tbody>
      </table>
    </div>
  );
};