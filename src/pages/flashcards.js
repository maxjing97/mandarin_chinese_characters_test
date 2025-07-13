import "./accounts_cards.css"
import React, {useState, useRef, useEffect, use} from 'react';
import {Link, useNavigate, useNavigationType} from "react-router-dom"
import {auth} from "../context/auth"
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "../context/userContext";
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
import tradword from './data/tradwords.json'; //import json fo 
import simpword from './data/simpwords.json'; //import json 

//function to get characterjson based on index, datatype:("C", "W") and chartype: ("t","s")
//simplified function to get all jsons for the 4 possible categories
function getInfo(index, chartype, datatype) {
  //get load in jsondata of can characters based on character type and practice type
  if(datatype == "C" && chartype == "t") {
    return tradchar[index.toString()]
  } else if (datatype === "C" && chartype == "s") {
    return simpchar[index.toString()]
  } else if(datatype == "W" && chartype == "t") {
    return tradword[index.toString()]
  } else if (datatype == "W" && chartype == "s") {
    return simpword[index.toString()]
  }
  return null
}

//row details for the addcard part 
const CharDetailsRow = ({charJson, index, deckname, setCount, contained}) => { //current table row format displaying, for adding and deleting cards from the id
  const [checked, setChecked] = useState(false)
  const [fixed, setfixed] = useState(false) //set if fixed (set as fixed if in contained)
  const [backgroundcolor, setbackgroundcolor] = useState("white")//set background color 
  const {userlogin, addcard, removecard, isFetching} = useUser();
  const queryClient = useQueryClient()
  //if the current charJson is already in the list of contained jsons, we mark as checked to avoid duplicates
  useEffect(() => {
    //loop through list of contained json files
    for(const currjson of contained) {
      if(JSON.stringify(currjson) === JSON.stringify(charJson)){
        setChecked(true) //if we see a containment, mark as checked to avoid duplicates
        setbackgroundcolor("rgb(173, 173, 173)")
        setfixed(true)
        return
      }
    }
  },[])

  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (!fixed) {
      if (checked) { //remove path call if it is checked and not fixed 
        removecard(userlogin.uid,index, deckname, "C", charJson["code"])
        queryClient.invalidateQueries(["cards"])
        //if data is loading, pause
        while(isFetching) {}
        setCount(prev=>prev-1) //decrement
        setChecked(prev=>!prev)
        setbackgroundcolor("white")
      } else { //addcard call
        addcard(userlogin.uid,index, deckname, "C", charJson["code"])
        queryClient.invalidateQueries(["cards"])
        setCount(prev=>prev+1) //increment
        setChecked(prev=>!prev)
        setbackgroundcolor("rgb(71, 237, 112)")
      }
      setTimeout(() => {
      }, 250); //quarter s timeout 
    }
  }
  return (
    <tr style={{backgroundColor: backgroundcolor}}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td id="addtable-entry"><button onClick={()=>handleChange()} id="table-button">{charJson["word/character"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["definition"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["full_pronunciation"]}</button></td>
      <td>{charJson["cat"]}</td>
      <td>{index}</td>
    </tr>
  );
};
const DefDetailsRow = ({charJson, index, deckname, setCount, contained}) => {
  const [checked, setChecked] = useState(false)
  const [fixed, setfixed] = useState(false) //set if fixed (set as fixed if in contained)
  const [backgroundcolor, setbackgroundcolor] = useState("white")//set background color 
  const {userlogin, addcard, removecard, isFetching} = useUser();
  const queryClient = useQueryClient()
  //if the current charJson is already in the list of contained jsons, we mark as checked to avoid duplicates
  useEffect(() => {
    //loop through list of contained json files
    for(const currjson of contained) {
      if(JSON.stringify(currjson) === JSON.stringify(charJson)){
        setChecked(true) //if we see a containment, mark as checked to avoid duplicates
        setbackgroundcolor("rgb(173, 173, 173)")
        setfixed(true)
        return
      }
    }
  },[])

  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (!fixed) {
      if (checked) { //remove path call if it is checked and not fixed 
        removecard(userlogin.uid,index, deckname, "W", charJson["code"])
        queryClient.invalidateQueries(["cards"])
        setCount(prev=>prev-1) //decrement
        setChecked(prev=>!prev)
        setbackgroundcolor("white")
      } else { //addcard call
        addcard(userlogin.uid,index, deckname, "W", charJson["code"])
        queryClient.invalidateQueries(["cards"])
        setCount(prev=>prev+1) //increment
        setChecked(prev=>!prev)
        setbackgroundcolor("rgb(71, 237, 112)")
      }
    }
  }
  return (
    <tr style={{backgroundColor: backgroundcolor}}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["word/character"]}</button></td>
      <td><button onClick={()=>handleChange()} id="table-button">{charJson["definition"]}</button></td>
      <td>{charJson["cat"]}</td>
      <td>{index}</td>
    </tr>
  );
};

//show card details, including type. Allow cards to be selected 
function Card({dbjson, infojson, toggleRemove}) {
  const [checked, setChecked] = useState(false) //check if a card has been checked (for deletion)
  const{char_type,data_type,deck_name,idx,user_id} = dbjson //destructure data from database

  //handle cheked
  const handleCheck = () => {
    if(checked) {
      toggleRemove(checked, idx, data_type, char_type)
      setChecked(false)
    } else {
      toggleRemove(checked, idx, data_type, char_type)
      setChecked(true)
    }
  }

  return (
    <div>
    { infojson && 
    <div className="info-card">
      <h3>{infojson["word/character"]}</h3>
      <p>Definition: {infojson["definition"]}</p>

      <p>Character type: {infojson["code"]==="s" ? "Simplified":"Traditional"}</p> 
      {data_type=="C" &&
        <p>Pronunciation: {infojson["full_pronunciation"]}</p>
      }

      <button onClick={handleCheck} id="trash-deck" style={{backgroundColor: !checked ? "rgb(255, 53, 53)":"rgb(32, 216, 47)"}}> {/*conditionally change style based on selection*/}
        {!checked ? "Delete": "Keep"}
      </button>
    </div>
    }
    </div>
  )
}

//get deck details from clicking set, get all detail of cards
function DeckCards({data,setClosed}) {  
  const queryClient = useQueryClient()
  const {rawdata, cardsmap, isLoading} = useUser() //get the new information from the context
  const [currData, setCurrData] = useState(data)//current card data (format given here)
  const {userlogin, removecard} = useUser()
  const [infoList, setInfoList] = useState([]) //get json information of the current deck of cards, 
  const [typeList, setTypeList] = useState([])  //store the type of data (words or characters) (should be the same length as the infolist)
  const [cardcount, setCardCount] = useState(0)//getCount of cards
  const [removejson, setRemovejson] = useState(new Map())//map of lists to remove
  const [removesize, setRemovesize] = useState(0)//store map size as a state component to force edits to the dom
  const [addclosed, setAddclosed] = useState(true)//store if the addcard component is closed


  //prepare the original data
  useEffect(()=>{
    const info_list = []
    const type_list = []
    const datalist = currData[1]
    for(const json of datalist) {
      const{char_type,data_type,deck_name,idx,user_id} = json
      const info = getInfo(idx,char_type,data_type)
      info_list.push(info)
      type_list.push(data_type)
    }
    setInfoList(info_list)
    setTypeList(type_list)
    setCardCount(info_list.length)
  },[currData, rawdata, cardsmap]) //change only if the current data used changes

  //function to trigger the refresh of the card data, by retreving current cardsmap data from the context, which should be refreshed after invalidating query. Useful when add is called
  const refresh = () =>{
    //invalidate queries
    //loop through the deck indices in the map to find a matching json object
    const deckname = currData[0]
    //get the single json object mapping the deckname to a list of jsons
    let newdata = [] //get new list json data of cards
    for(const key of cardsmap.keys()) {
      if(key === deckname) {
        newdata = cardsmap.get(key)
        break
      }
    }
    //add deckname to the list 
    newdata = [deckname,newdata]
    setCurrData(newdata)//set the current data based on deckname
  }

  //trigger button to remove all cards in the json list 
  const removeCards = () => {
    const confirm = window.confirm("remove selected cards?")
    if (confirm) {
      for (const key of removejson.keys()) {
        const [index, deckname, data_type, char_type]= removejson.get(key) //destructure 
        removecard(userlogin.uid, index, deckname, data_type, char_type)
        queryClient.invalidateQueries(["cards"])
        setCardCount(prev=>prev-1)//incrment
      }
      setRemovesize(0)
      setClosed(true) //return to menu
    } else {
      return
    }
  }

  //add/remove a card to the deletion list a card if needed
  const toggleRemove=(checked,idx, data_type, char_type)=>{
    const key = `${idx}-${data_type}-${char_type}` //key
    //if already checked, remove from deletion list
    if (checked) {
      const copy = removejson
      copy.delete(key)
      setRemovejson(copy)
      setRemovesize(prev=>prev-1)
    } else { //else, add to list: key is the idx, data_type, char_type
      const copy = removejson
      copy.set(key,[idx, data[0], data_type, char_type]) 
      setRemovejson(copy)
      setRemovesize(prev=>prev+1)
    }
  }


  {/*open add deck if prompted*/}
  return (
    <div>
      <h3>"{currData[0]}" Deck</h3>
      {addclosed &&
      <div>
        <div id="view-deck-cards">
          {currData[1].map((json, index)=>(
            <Card key={index} dbjson={json} datatype={typeList[index]} infojson={infoList[index]} toggleRemove={toggleRemove}/>
          ))}
        </div>
        <p>Count : {cardcount}</p>
        <div id="deck-options-selector">
          <button onClick={()=>setClosed(true)} id="menu-button">
              Exit to menu
          </button>
          {removesize > 0 && 
          <button onClick={()=>removeCards()} id="menu-button" style={{backgroundColor: "rgb(255, 53, 53)", color:"white"}}>
            Delete {removesize } selected card{removesize === 1 ? "":"s"}
          </button>
          }
          <button onClick={()=>setAddclosed(false)} id="menu-button">
            Add Card
          </button>
        </div>
      </div>
      }
      {!addclosed &&
        <AddDeck setClosed={setAddclosed} defaultdeckname={data[0]} contained={infoList} refresh={refresh}/>
      }
    </div>
  )
}

function Deck({data, setDeckCount, setClosed, setAltcomp}) {
  const {userlogin, removedeck} = useUser()
  const queryClient = useQueryClient()
  //display if details are being shown
  const handleRemove = () => {
    //confirm with user 
    const confirmed = window.confirm(`Are you sure you want to delete this deck, ${data[0]}`);
    if(confirmed) {
      removedeck(userlogin.uid, data[0])
      setDeckCount(prev=>prev-1) //decrement 
      queryClient.invalidateQueries(["cards"])
    } else {
      return
    }
  }
  //handle when function is called to show details
  const handleDetails = () =>{
    setClosed(false) //expose the card deck
    setAltcomp(<DeckCards data={data} setClosed={setClosed}/>)
  }
  
  return (
    <div>
      <div className="deck">
        <button id="goto-deck" onClick={handleDetails}>
        <h3>{data[0]}</h3>
        <h3>{data[1].length} Cards</h3>
        </button>
        <button onClick={handleRemove} id="trash-deck">
          Delete
        </button>
      </div>
    </div>
  )
}

//add deck component: display list of characters with button (default parameter for when the deckname is fixed). setDeckCount to empty when do deck is added, but we are trying to add to a deck
function AddDeck({setClosed, setDeckCount=()=>{}, defaultdeckname = null, contained=[], refresh=()=>{}}) {   
  const [deckname, setDeckname] = useState("")
  const [showdecknameinput, setShowdecknameinput] = useState(true) //set if deckname input is shown
  const [charType, setCharType] = useState("Trad")  
  const [dataType, setDataType] = useState("characters")
  const [isSet, setisSet] = useState(false) //check if the name has been set yet
  const [count, setCount] = useState(0)//count of cards added 
  const {cardsmap, isFetching} = useUser()
  const queryClient = useQueryClient()
  useEffect(()=>{
    if(defaultdeckname) {
      setDeckname(defaultdeckname)//set the deckname
      setShowdecknameinput(false)
      setisSet(true) //show the rest 
    } 
    //at start, if default deckname is not null, we disable the showing of the input 
  },[])

  //check if the deckname has been taken
  const handledeckname = (e) =>{
    if (deckname.length ===0) {
      alert("deck name must but be empty")
    } else if (cardsmap.has(deckname.trim())) {
      alert("deck name must but be unique, try again")
      setDeckname("") //reset the string
    } else {
      setisSet(true)
    }
  }

  //handle clicking submit for a character type
  const handleClick = (newCharType, newDataType) => {
    setCharType(newCharType)//set values
    setDataType(newDataType) 
  }
  //function to handle save
  const handleSave = () => {
    refresh()//call refresh function if any
    setDeckCount(prev=>prev+1) //increment number of decks
    setClosed(true)//close
  }

  return (
    <div>
      {showdecknameinput && 
      <div>
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
      </div>
      }
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
          <tbody>{Object.entries(tradchar).map((Json,i) => (
            <CharDetailsRow charJson={Json[1]} index={Json[0]} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="characters")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{Object.entries(simpchar).map((Json,i) => (
            <CharDetailsRow charJson={Json[1]} index={Json[0]} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Trad" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{Object.entries(tradword).map((Json,i) => (
            <DefDetailsRow charJson={Json[1]} index={Json[0]} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{Object.entries(simpword).map((Json,i) => (
            <DefDetailsRow charJson={Json[1]} index={Json[0]} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>
        </table>
      </div>}
    </div>
  )        
}
//Special add deck component (allows adding to any deck, given a list of json, used to add to cards after a practice session and missed cards)
export function PracticeAddDeck({dataType, mainjson}) {   
  const navigate = useNavigate()
  const [decks, setDecks] = useState(new Map()) //get decks map
  const [deckname, setDeckname] = useState("") //current selected deckname
  const [inputdeckname, setInputdeckname] = useState("") //current deckname typed if any
  const [isSet, setisSet] = useState(false) //check if the name has been set yet
  const [count, setCount] = useState(0)//count of cards added 
  const [contained, setContained] = useState([])//list of jsons contained (the jsons in each deck)
  const [infoList, setInfoList] = useState([]) //get json information of the current deck of cards selected
  const [deckcount, setDeckCount] = useState(0)//count the number of decks
  const {cardsmap} = useUser()
  
  useEffect(() => {
    //if user is logged, in set to the actual data
    if(cardsmap) {
      setDecks(cardsmap)
      setDeckCount(cardsmap.size)
    }
  })

  //check if the newdeckname has been taken
  const handlenewdeckname = (e) =>{
    if (deckcount === 5) {
      alert("cannot create new decks at this time")
    }
    else if (inputdeckname.length ===0) {
      alert("deck name must but be empty")
    } else if (cardsmap.has(inputdeckname.trim())) { //check if this is key in the map
      alert("deck name must but be unique, try again")
      setInputdeckname("") //reset the string
    } else {
      setDeckname(inputdeckname) //set the actual deckname used to be the same as the input
      setisSet(true)
    }
  }
  //handle if an existing deckname has been checked
  const currdeckname = (name,data) =>{
    //find the json of characters contained in the current deck
    const info_list = []
    const datalist = data[1]
    for(const json of datalist) {
      const{char_type,data_type,deck_name,idx,user_id} = json
      const info = getInfo(idx,char_type,data_type)
      info_list.push(info)
    }
    setContained(info_list)
    setDeckname(name)
    setisSet(true)
  }

  //function to handle save
  const handleSave = () => {
    setDeckCount(prev=>prev+1) //increment number of decks
    navigate("/flashcards")//close
  }

  //since the randomly characters maybe out of order, we have the manually find the index using a search
  const findIndex = (json) => {
    //based on the types, find the data needed 
    let currdata = null
    if(dataType === "characters" && json["code"] === "t") {
      currdata = tradchar
    } else if (dataType === "characters" && json["code"] === "s") {
      currdata = simpchar
    } else if(dataType === "words" && json["code"] === "t") {
      currdata = tradword
    } else if (dataType === "words" && json["code"] === "s") {
      currdata = simpword
    }
    //loop through and find the key based on the definition, character and particular dataset found
    for(const key in currdata) {
      const currcharjson = currdata[key] //current character json
      if(currcharjson["definition"]===json["definition"] && currcharjson["word/character"]===json["word/character"]) {
        return key
      }
    }
    return -1
  }

  return (
    <div>
    { cardsmap &&
    <div> 
      <h3>{deckcount > 0? "Select a Deck or create a new one": "Get started by creating a deck"}</h3>
      <div id="practice-deck-selector"> {/*collapse decks map into a list mapping into the key and a 2 length array */}
        {[...decks].map((value, key)=>( 
          <div className="deck-button"> 
              <input type="radio" name="chartype" id={key} onClick={() => currdeckname(value[0],value)} className="charbutton" checked={deckname === value[0]} disabled={isSet}></input>
              <label class="decklabel" htmlFor ={key}>{value[0]}</label>
          </div>
        ))}      
        <div className="deck-button"> 
          <input type="radio" name="chartype" id="new" className="charbutton" disabled={isSet}></input>
          <label class="decklabel" >+</label>
          <input
            type="text"
            value = {inputdeckname}
            id="deck-name"
            onChange={(e)=>{setInputdeckname(e.target.value)}}
            placeholder="add new deck"
            disabled={isSet}
          />
          <button id='card-name-save' onClick={handlenewdeckname}>Save</button>
        </div>
      </div>
      {isSet &&
      <div>
      <h3>Add Cards to the deck selected, {deckname} ,from the list of characters missed</h3>
      <div id="addchars-show">
        <button id="save-cards" onClick={handleSave}>{count} cards added, Save and Exit</button>
      </div>
        <table class="char_table" hidden={!(dataType==="characters")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{mainjson.map((Json,i) => (
            <CharDetailsRow charJson={Json} index={findIndex(Json)} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(dataType==="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{mainjson.map((Json,i) => (
            <DefDetailsRow charJson={Json} index={findIndex(Json)} deckname={deckname} setCount={setCount} contained={contained}/>
          ))}</tbody>
        </table>
      </div>}
    </div>
    }
    {!cardsmap &&
    <div>
      <p>Not logged in! Create your account to save flashcards in the future</p>
    </div>
    }
    </div>
  )        
}

//components to display the flash card preview
export default function Flashcards() { 
  const {cardsmap} = useUser()
  const [decks, setDecks] = useState([]) //get decks map
  const [isaltclosed, setAltclosed] = useState(true)//check to close the alternative tab (addCard)
  const [altcomp, setAltcomp] = useState(null)//set alternative component to show
  const [deckcount, setDeckCount] = useState(cardsmap.size)//count the number of decks

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
      setAltclosed(false)
      //prepare test data

      setAltcomp(<AddDeck setClosed={setAltclosed} setDeckCount={setDeckCount}/>)//set the component to show the add cards component 
    }
  }

  return (
    <div id="main-decks-display"> 
      { isaltclosed &&
      <div className="main-decks-display">
        <h2>My Flashcard Decks</h2>
        <div id="full-decks-display">
          {
            [...decks].map((value, key) => ( 
              <Deck data={value} key={key} setDeckCount={setDeckCount} setClosed={setAltclosed} setAltcomp={setAltcomp}/>
            ))
          }
          {/* button to add a deck*/}
          <button id="add-deck" onClick={handleAddDeck}>
            <img src="/media/add.png" alt="add" className="deck-icon"/>
          </button>
        </div>
        <p>{deckcount===0 ? `Get Started by creating a deck`:`Deck Count: ${deckcount}`}</p>
      </div>}
      { !isaltclosed && 
        <div className="main-decks-display">
          {altcomp}   
        </div>
      }
    </div>
  );
}

//component to add particular cards to the deck