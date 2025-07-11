import "./accounts_cards.css"
import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../context/auth"
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "../context/userContext";
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
import tradword from './data/tradwords.json'; //import json fo 
import simpword from './data/simpwords.json'; //import json 


//row details 
const CharDetailsRow = ({charJson, index, deckname}) => { //current table row format displaying, for adding and deleting cards from the id
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false)
  const {userlogin, addcard, removecard} = useUser();
  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (checked) { //remove path call
      removecard(userlogin.uid,index, deckname, "C", charJson["code"])
    } else { //addcard call
      addcard(userlogin.uid,index, deckname, "C", charJson["code"])
    }
    queryClient.invalidateQueries({queryKey: "cards"})
    setChecked(prev=>!prev)
  }
  return (
    <tr>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td>{charJson["word/character"]}</td>
      <td>{charJson["definition"]}</td>
      <td>{charJson["full_pronunciation"]}</td>
      <td>{charJson["cat"]}</td>
    </tr>
  );
};
const DefDetailsRow = ({charJson, index, deckname}) => {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false)
  const {userlogin, addcard, removecard} = useUser();
  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (checked) { //remove path call
      removecard(userlogin.uid,index, deckname, "C", charJson["code"])
    } else { //addcard call
      addcard(userlogin.uid,index, deckname, "C", charJson["code"])
    }
    queryClient.invalidateQueries({queryKey: "cards"})
    setChecked(prev=>!prev)
  }
  return (
    <tr>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td>{charJson["word/character"]}</td>
      <td>{charJson["definition"]}</td>
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


function Deck({data}) {
  return (
    <div className="deck">

    </div>
  )
}

//add deck component: display list of characters with button
function AddDeck({close}) {   
  const [deckname, setDeckname] = useState("")
  const [charType, setCharType] = useState("Trad")  
  const [dataType, setDataType] = useState("characters")
  const [displayJson, setDisplayJson] = useState([]) //jsons to display (depends on the options chosen)
  //list 
  //check if the deckname has been taken
  const handledeckname = (e) =>{
    const val = e.target.value
    //check if the check name has been taken
    setDeckname(val)
  }
    
  //run after each mount only
  useEffect(() => {
    const jsons = getJsons(charType, dataType)//get jsons
    setDisplayJson(jsons)
  }, [])
  //handle clicking submit for a character type
  const handleClick = (newCharType, newDataType) => {
    setCharType(newCharType)//set values
    setDataType(newDataType) 
    const jsons = getJsons(newCharType, newDataType)//get jsons
    setDisplayJson(jsons)
  }

  return (
    <div id="add-deck">
      <h3>Give a name for the deck</h3>
      <input
        type="text"
        value = {deckname}
        id="deck-name"
        onChange={handledeckname}
        placeholder="deck name"
      />
      <h3>Add Cards to the deck from the list of characters</h3>
      <div>
        <div className="charbuttonContainer">
            <h2 className="selectCat">Select Character type: </h2>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c1" onClick={() => handleClick("Trad", dataType)} className="charbutton" checked={charType === 'Trad'}></input>
                <label htmlFor ="c1">Traditional</label>
            </div>
            <div className="charbutton"> 
                <input type="radio" name="chartype" id="c2" onClick={() => handleClick("Simp", dataType)} className="charbutton"></input>
                <label htmlFor ="c2">Simplified</label>
            </div>     
        </div>
        <div className="charbuttonContainer">
            <h2 className="selectCat">Type:</h2>
            <div className="charbutton"> 
                <input type="radio" name="wordtype" id="w1" onClick={() => handleClick(charType, "characters")} className="charbutton" checked={dataType === 'characters'}></input>
                <label htmlFor ="w1">Unique Characters</label>
            </div>
            <div className="charbutton"> 
                <input type="radio" name="wordtype" id="w2" onClick={() => handleClick(charType, "words")} className="charbutton"></input>
                <label htmlFor ="w2">Words</label>
            </div>     
        </div>
      </div>
      {dataType==="characters" ?
      <table class="char_table">
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>diffculty category</th></tr></thead>
          <tbody>{displayJson.map((Json, i) => (
            <CharDetailsRow charJson={Json} index={i} deckname={deckname}/>
          ))}</tbody>        
      </table>:
      <table class="char_table">
        <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th></tr></thead>
        <tbody>{displayJson.map((Json, i) => (
          <DefDetailsRow charJson={Json} index={i} deckname={deckname}/>
        ))}</tbody>
      </table>}
    </div>
  )        
}

//components to display the flash card preview
export default function Flashcards() { 
  const navigate = useNavigate();
  const {userlogin, rawcards} = useUser()
  const [decks, setDecks] = useState([])
  const [addDeck, setAddDeck] = useState(false)//check if add deck is clicked, then show the popup

  useEffect(() => {
    //if user is logged, in set to the actual data
    if(rawcards) {
      setDecks(rawcards)
    }
  },[rawcards])

  console.log("card data:", rawcards)
  return (
    <div id="characters-list"> 
      { !addDeck && 
      <div className="cards-display">
        <h2>My Flashcards</h2>
        {
          decks.map((deck, index) => (
            <Deck data={deck}/>
          ))
        }
        {/* button to add a deck*/}
        <button className="deck" onClick={()=>{setAddDeck(true)}}>
          <img src="/media/add.png" alt="add" className="deck-icon"/>
        </button>
      </div>}
      { addDeck && 
        <AddDeck close={setAddDeck}/>
      }
    </div>
  );
}

//component to add particular cards to the deck