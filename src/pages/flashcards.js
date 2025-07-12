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


//row details for the addcard part 
const CharDetailsRow = ({charJson, index, deckname, setCount}) => { //current table row format displaying, for adding and deleting cards from the id
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false)
  const {userlogin, addcard, removecard} = useUser();
  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (checked) { //remove path call
      removecard(userlogin.uid,index, deckname, "C", charJson["code"])
      setCount(prev=>prev-1) //decrement
    } else { //addcard call
      addcard(userlogin.uid,index, deckname, "C", charJson["code"])
      setCount(prev=>prev+1) //increment
    }
    queryClient.invalidateQueries({queryKey: ["cards"]})
    setChecked(prev=>!prev)
  }
  return (
    <tr style={{backgroundColor: checked ? "rgb(71, 237, 112)":"white"}}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td id="addtable-entry"><button onClick={()=>handleChange()} id="table-button">{charJson["word/character"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["definition"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["full_pronunciation"]}</button></td>
      <td>{charJson["cat"]}</td>
      <td>{index}</td>
    </tr>
  );
};
const DefDetailsRow = ({charJson, index, deckname, setCount}) => {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false)
  const {userlogin, addcard, removecard} = useUser();
  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (checked) { //remove path call
      removecard(userlogin.uid,index, deckname, "W", charJson["code"])
      setCount(prev=>prev-1) //decrement
    } else { //addcard call
      addcard(userlogin.uid,index, deckname, "W", charJson["code"])
      setCount(prev=>prev+1) //increment
    }
    queryClient.invalidateQueries({queryKey: ["cards"]})
    setChecked(prev=>!prev)
  }
  return (
    <tr style={{backgroundColor: checked ? "rgb(71, 237, 112)":"white"}}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["word/character"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["definition"]}</button></td>
      <td>{charJson["cat"]}</td>
      <td>{index}</td>
    </tr>
  );
};



//get deck details from clicking set, get all detail of cards
function DeckCards({data,setMainclosed}) {  
  //store count of cards
  
  return (
    <div>
      <h3>"{data[0]}" Deck</h3>
      <p>{JSON.stringify(data[1])}</p>

      <button onClick={()=>setMainclosed(false)} id="menu-button">
          Exit to menu
      </button>
    </div>
  )
}

function Deck({data, setDeckCount, setMainclosed, setAltcomp}) {
  const {userlogin, removedeck} = useUser()
  const queryClient = useQueryClient()
  //display if details are being shown
  const handleRemove = () => {
    //confirm with user 
    const confirmed = window.confirm(`Are you sure you want to delete this deck, ${data[0]}`);
    if(confirmed) {
      removedeck(userlogin.uid, data[0])
      //invalidate
      setDeckCount(prev=>prev-1) //decrement 
      queryClient.invalidateQueries({queryKey:["cards"]})
    } else {
      return
    }
  }
  //handle when function is called to show details
  const handleDetails = () =>{
    setMainclosed(true)
    setAltcomp(<DeckCards data={data} setMainclosed={setMainclosed}/>)
  }
  
  return (
    <div>
      <div className="deck">
        <button id="goto-deck" onClick={handleDetails}>
        <h3>{data[0]}</h3>
        <h3>{data[1].length} Cards</h3>
        </button>
        <button onClick={handleRemove} id="trash-deck">
          ❌
        </button>
      </div>
    </div>
  )
}

//add deck component: display list of characters with button
function AddDeck({setMainclosed, setDeckCount}) {   
  const [deckname, setDeckname] = useState("")
  const [charType, setCharType] = useState("Trad")  
  const [dataType, setDataType] = useState("characters")
  const [isSet, setisSet] = useState(false) //check if the name has been set yet
  const [count, setCount] = useState(0)//count of cards added 
  const {cardsmap} = useUser()
  //check if the deckname has been taken
  const handledeckname = (e) =>{
    if (deckname.length ===0) {
      alert("deck name must but be empty")
    } else if (cardsmap.has(deckname.trim())) {
      alert("deck name must but be unique")
      setMainclosed(false)//close
    } else {
      setisSet(true)
    }
  }
  //get json list 
//simplified function to get all jsons for the 4 possible categories
  const JsonToList = (jsonData) => {
    //get load in jsondata of can characters based on character type and practice type
    let retjsonlist = []
    //first get all json matching the category range 
    for (const key in jsonData) {
      const json = jsonData[key] //get json list
      retjsonlist.push(json)
    }
    return retjsonlist 
  }

  //handle clicking submit for a character type
  const handleClick = (newCharType, newDataType) => {
    setCharType(newCharType)//set values
    setDataType(newDataType) 
  }
  //function to handle save
  const handleSave = () => {
    setDeckCount(prev=>prev+1) //increment number of decks
    setMainclosed(false)//close
  }

  return (
    <div id="add-deck">
      <h3>Give a name for the deck</h3>
      <input
        type="text"
        value = {deckname}
        id="deck-name"
        onChange={(e)=>{setDeckname(e.target.value)}}
        placeholder="deck name"
        disabled={isSet}
      />
      <button id='card-name-save' onClick={handledeckname}>Save</button>
      {isSet &&
      <div>
      <h3>Add Cards to the deck from the list of characters</h3>
      <div id="addchars-show">
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
        <button id="save-cards" onClick={handleSave}>{count} cards added, Save and Exit</button>
      </div>
        <table class="char_table" hidden={!(charType=="Trad" && dataType=="characters")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{JsonToList(tradchar).map((Json,i) => (
            <CharDetailsRow charJson={Json} index={i} deckname={deckname} setCount={setCount}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="characters")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{JsonToList(simpchar).map((Json,i) => (
            <CharDetailsRow charJson={Json} index={i} deckname={deckname} setCount={setCount}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Trad" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{JsonToList(tradword).map((Json,i) => (
            <DefDetailsRow charJson={Json} index={i} deckname={deckname} setCount={setCount}/>
          ))}</tbody>
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{JsonToList(simpword).map((Json,i) => (
            <DefDetailsRow charJson={Json} index={i} deckname={deckname} setCount={setCount}/>
          ))}</tbody>
        </table>
      </div>}
    </div>
  )        
}

//components to display the flash card preview
export default function Flashcards() { 
  const navigate = useNavigate();
  const {cardsmap, rawdata} = useUser()
  const [decks, setDecks] = useState([]) //get checks map
  const [ismainclosed, setMainclosed] = useState(false)//check to close the main
  const [altcomp, setAltcomp] = useState(null)//set alternative component to show
  const [deckcount, setDeckCount] = useState(cardsmap.size)//count the number of decks
  const queryClient = useQueryClient()

  useEffect(() => {
    //if user is logged, in set to the actual data
    if(cardsmap) {
      setDecks(cardsmap)
      setDeckCount(cardsmap.size)
    }
  })
  //function to add a deck
  const handleAddDeck = () => {
    if (deckcount === 5) {
      alert("cannot create more than 5 decks with your account") //5 flashcard deck limit
    } else {
      setMainclosed(true)
      setAltcomp(<AddDeck setMainclosed={setMainclosed} setDeckCount={setDeckCount}/>)//set the component to show
    }
  }

  return (
    <div id="main-decks-display"> 
    
      { !ismainclosed &&
      <div className="main-decks-display">
        <h2>My Flashcard Decks</h2>
        <div id="full-decks-display">
          {
            [...decks].map((value, key) => ( 
              <Deck data={value} key={key} deckname={key} setDeckCount={setDeckCount} setMainclosed={setMainclosed} setAltcomp={setAltcomp}/>
            ))
          }
          {/* button to add a deck*/}
          <button id="add-deck" onClick={handleAddDeck}>
            <img src="/media/add.png" alt="add" className="deck-icon"/>
          </button>
        </div>
        <p>{deckcount===0 ? `Get Started by creating a deck`:`Deck Count: ${deckcount}`}</p>
      </div>}
      { ismainclosed && 
        <div className="main-decks-display">
          {altcomp}   
        </div>
      }
    </div>
  );
}

//component to add particular cards to the deck