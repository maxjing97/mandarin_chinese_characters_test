import './main.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 


const DetailsRow = ({charJson, index}) => {
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

//simplified function to get all jsons for the 5 possible categories
function getJsons(character_type, list_type) {
  //get load in jsondata of can characters based on character type and practice type
  let jsonData = null 
  let retjsonlist = []
  if(list_type === "characters" && character_type === "Trad") {
    jsonData = tradchar
  } else if (list_type === "characters" && character_type === "Simp") {
    jsonData = simpchar
  }
  //first get all json matching the category range 
  for (const key in jsonData) {
    const json = jsonData[key] //get json list
    retjsonlist.push(json)
  }
  return retjsonlist 
}

//child component 4: component to display the final results and give a list of missed results 
export function CharList () {
  const location = useLocation();
  const [displayJson, setDisplayJson] = useState([]) //jsons to display (depends on the options chosen)
  const [charType, setCharType] = useState("Trad") //set character type

//run after each render
  useEffect(() => {
    const jsons = getJsons(charType, "characters")//get jsons
    setDisplayJson(jsons)
})

  
  useEffect(()=>{
    return () => {} 
  }, []) //call only once on mount
  //if display components if they correpond to a one missed and are a defintion component
  return (
    <div id='characters-list'>
      <h2>Characters List</h2>
      <p>This is the list of characters tested in the practice character and unique character words tested in the practice characters section</p>
      <p>(Also includes words where one of the characters is unique in the list)</p>
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
      <table>
        <tr><th>Count</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>diffculty category</th></tr>
        {displayJson.map((Json, i) => (
          <DetailsRow charJson={Json} index={i+1}/>
        ))}
      </table>
    </div>
  );
};