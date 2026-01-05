import "./accounts_cards.css"
import React, {useState, useRef, useEffect, use} from 'react';
import {Link, useNavigate, useNavigationType} from "react-router-dom"
import {auth} from "../context/auth"
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "../context/userContext";
import PracticeCardDefinition from "./practicecardsdefs"
import PracticeCardPronunciation from "./practicecardspros"
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

//row details for the addcard part, for single characters 
const CharDetailsRow = ({charJson, index, deckname, toggleAdd, contained, initial_checked = false}) => { //current table row format displaying, for adding and deleting cards from the id
  const [checked, setChecked] = useState(initial_checked)
  const [fixed, setfixed] = useState(false) //set if fixed (set as fixed if in contained)
  const [backgroundcolor, setbackgroundcolor] = useState("white")//set background color 
  const {userlogin} = useUser();
  //if the current charJson is already in the list of contained jsons, we mark as checked to avoid duplicates
  useEffect(() => {
    if (initial_checked) { //set color based on if it is checked 
      setbackgroundcolor("rgba(129, 255, 161, 1)")
      setChecked(initial_checked)
    } else {  //set color based on if it is checked 
      setbackgroundcolor("white")
    }
    //loop through list of contained json files
    for(const currjson of contained) {
      if(JSON.stringify(currjson) === JSON.stringify(charJson)){
        setChecked(true) //if we see a containment, mark as checked to avoid duplicates
        setbackgroundcolor("rgb(173, 173, 173)")
        setfixed(true)
        return
      }
    }
  },[initial_checked])

  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (!fixed) {
      const data = { 
        user_id:userlogin.uid,
        idx:index,
        deck_name:deckname,
        data_type:"C",
        char_type:charJson["code"]
      }
      if (checked) { //remove path call if it is checked and not fixed 
        toggleAdd(data,checked)
        setbackgroundcolor("white")
        setChecked(false)
      } else { //addcard call
        toggleAdd(data,checked)
        setbackgroundcolor("rgba(129, 255, 161, 1)")
        setChecked(true)
      }
    }
  }
  return (
    <tr id="add-card-row" onClick={()=>handleChange()} style={{backgroundColor: backgroundcolor}}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td id="addtable-entry">
        <p id="table-button" style={{textDecorationLine: checked?  "underline" : "none"}}>{charJson["word/character"]}</p>
      </td>
      <td><p id="table-button">{charJson["definition"]}</p></td>
      <td><p id="table-button">{charJson["full_pronunciation"]}</p></td>
      <td>{charJson["cat"]}</td>
    </tr>
  );
};
//row details for the addcard part, result details for multi-character words
const DefDetailsRow = ({charJson, index, deckname, toggleAdd, contained, initial_checked = false}) => {
  const [checked, setChecked] = useState(initial_checked)
  const [fixed, setfixed] = useState(false) //set if fixed (set as fixed if in contained)
  const {userlogin} = useUser();

  //if the current charJson is already in the list of contained jsons, we mark as checked to avoid duplicates
  useEffect(() => {
    if (initial_checked) { //set color based on if it is checked 
      setChecked(initial_checked)
    } 
    //loop through list of contained json files
    for(const currjson of contained) {
      if(JSON.stringify(currjson) === JSON.stringify(charJson)){
        setChecked(true) //if we see a containment, mark as checked to avoid duplicates
        setfixed(true)
        return
      }
    }
  },[initial_checked])

  const handleChange = (e) => {
    //if changing to checked, add card, etc, and more
    if (!fixed) {
      const data = { 
        user_id:userlogin.uid,
        idx:index,
        deck_name:deckname,
        data_type:"W",
        char_type:charJson["code"]
      }
      if (checked) { //remove path call if it is checked and not fixed 
        toggleAdd(data,checked)
        setChecked(false)
      } else { //addcard call
        toggleAdd(data,checked)
        setChecked(true)
      }
    }
  }
  return (
    <tr id="add-card-row" onClick={()=>handleChange()} style={{backgroundColor: checked ? "rgba(129, 255, 161, 1)": "white" }}>
      <td><input id="check-character" type="checkbox" checked={checked} onChange={handleChange}/></td>
      <td><p id="table-button"  style={{textDecorationLine: checked?  "underline" : "none"}}>{charJson["word/character"]}</p></td>
      <td><p id="table-button">{charJson["definition"]}</p></td>
      <td><p id="table-button">{charJson["full_pronunciation"]}</p></td>
      <td>{charJson["cat"]}</td>
    </tr>
  );
};

//show card details, including type. Allow cards to be selected 
function Card({dbjson, infojson, toggleRemove, removesize}) {
  const [checked, setChecked] = useState(false) //check if a card has been checked (for deletion)
  const{char_type,data_type,deck_name,idx,user_id} = dbjson //destructure data from database

  useEffect(()=>{
    if(removesize === 0) {
      setChecked(false) //avoid checking bugs
    }
  })

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
      {data_type=="C" ?
        <p className="card-type-text">Single Character (字)</p>
        :
        <p className="card-type-text">Multi-Character word (詞)</p>
      }
      <h3>{infojson["word/character"]}</h3>
      <p className="card-text">Definition: {infojson["definition"]}</p>

      <p className="card-text">Character type: {infojson["code"]==="s" ? "Simplified":"Traditional"}</p> 

      <p className="card-text">Pronunciation: {infojson["full_pronunciation"]}</p>


      <button onClick={handleCheck} id="trash-deck" style={{backgroundColor: !checked ? "rgb(255, 53, 53)":"rgb(32, 216, 47)"}}> {/*conditionally change style based on selection*/}
        <p style={{padding:0, margin: 0}}>{!checked ? "✖": "↶"}</p>
      </button>
    </div>
    }
    </div>
  )
}

//key component that displays all the cards in a certain deck, once a deck is clicked. get deck details from clicking set, get all detail of cards within a certain flashcard deck, allowing redirect to practice 3 possibilitiies
function DeckCards({data,setClosed, setAltcomp}) {  
  const queryClient = useQueryClient()
  const navigate = useNavigate() //navigate
  const {rawdata, cardsmap, changedeckname,userlogin, removecard} = useUser() //get the new information, functions that link to the api from the context
  const [currData, setCurrData] = useState(data[1])//current card datalist from the db (format given here) initialze here
  const [deckname, setDeckname] = useState(data[0])//set deckname
  const [newname, setNewName] = useState(data[0])////current deckname to be set when changed
  const [showName,setShowName] = useState(false) //show the component to set a new deckanme
  const [infoList, setInfoList] = useState([]) //get json information of the current deck of cards, 
  const [typeList, setTypeList] = useState([])  //store the type of data (words or characters) (should be the same length as the infolist) ("C" or "W")
  const [cardcount, setCardCount] = useState(0)//getCount of cards
  const [removejson, setRemovejson] = useState(new Map())//map of lists to remove
  const [removesize, setRemovesize] = useState(0)//store map size as a state component to force edits to the dom
  const [addclosed, setAddclosed] = useState(true)//store if the addcard component is closed
  const [practicing, setPracticing] = useState(false) //if a practice component is opened
  const [practiceType, setPracticeType] = useState("")//type of practice set in handle practice
  
  //prepare the original data
  useEffect(()=>{
    const info_list = []
    const type_list = []
    const datalist = currData
    for(const json of datalist) {
      const{char_type,data_type,deck_name,idx,user_id} = json
      const info = getInfo(idx,char_type,data_type)
      info_list.push(info)
      type_list.push(data_type)
    }
    setCurrData(datalist)
    setInfoList(info_list)
    setTypeList(type_list)
    setCardCount(info_list.length)
  },[currData]) //change only if the current data used changes

  //count the number of single character data 
  const countChars = () => {
    let count = 0
    for (const char of typeList) {
      if(char==="C") {
        count++
      }
    }
    return count
  }

  //function to trigger the refresh of the card data, by retreving the newly added data
  const refresh = (newcarddata) =>{ //newcard data is a list of jsons, just like currData[1]
    const newlist = currData.concat(newcarddata)
    setCurrData(newlist)//set the current data based on deckname
    setAddclosed(true)//close adding frame
  }

  //trigger button to remove all cards in the json list 
  const removeCards = () => {
    //allow for simple removal if the deck would not be deleted
    if (removesize < cardcount) {
      let newData = currData
      for (const key of removejson.keys()) {
        const [index, deckname, data_type, char_type]= removejson.get(key) //destructure 
        removecard(userlogin.uid, index, deckname, data_type, char_type)
        setCardCount(prev=>prev-1)//incrment
        //remove from the deck (keep all values that do not match all the key conditions) demorgan's law
        //remove cases where the card matches the index, chartype, datatype, and 
        newData = newData.filter( prev=>(parseInt(prev.idx) != parseInt(index) || prev.char_type != char_type || prev.data_type != data_type) )
      }
      setCurrData(newData)
      setRemovesize(0)
      setRemovejson(new Map())
      queryClient.invalidateQueries(["cards"])
    } else {
      const confirm = window.confirm("Removing all cards left will delete the deck. Proceed?")
      if (confirm) {
        let newData = currData
        for (const key of removejson.keys()) {
          const [index, deckname, data_type, char_type]= removejson.get(key) //destructure 
          removecard(userlogin.uid, index, deckname, data_type, char_type)
          setCardCount(prev=>prev-1)//incrment
          //remove from the deck (keep all values that do not match all the key conditions) demorgan's law
          //remove cases where the card matches the index, chartype, datatype, and 
          newData = newData.filter( prev=>(parseInt(prev.idx) != parseInt(index) || prev.char_type != char_type || prev.data_type != data_type) )
        }
        setCurrData(newData)
        setRemovesize(0)
        setRemovejson(new Map())
        queryClient.invalidateQueries(["cards"])
        //return to menu if all cards are deleted, else keep in the same deck
        if (cardcount - removesize === 0) {
          setClosed(true) //return to menu
        } 
      } else {
        return
      }
    }
  }
  //undo remove
  const undoRemove = () => {
    setRemovesize(0)
    setRemovejson(new Map())
    return
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
  //handle practice 
  const handlePractice = (type) => {
    const data = {
      infojsons: infoList,//get list of infojsons
      typelist: typeList,
      test_type: type
    }
    setPracticeType(type)
    setPracticing(true)
  }
  //handle new deckname save
  const handledecknamechange = ()=> {
    if (newname.length ===0) {
      alert("new deck name must but not be empty")
      setNewName(deckname) //set to default
      setShowName(false) //close
      return
    } else if (cardsmap.has(newname.trim())) {
      alert("new deck name must but be unique, try again")
      setNewName(deckname) //set to default
      setShowName(false) //close
      return
    } else {
      changedeckname(userlogin.uid, deckname,newname)
      queryClient.invalidateQueries(["cards"])
      setDeckname(newname) //set the actual deckname shown to be this
      setShowName(false) //close
    }
  }

  {/*open add deck if prompted*/}
  return (
    <div id="flashcards-main">
      {!showName ?
        <div id="deckname">
          <button id='edit-card-name' onClick={()=>setShowName(true)}>✎</button>   
          <h3>{deckname}</h3>
        </div>
        :
        <div id="deckname-edit">
          <h3>Select a new deck name:</h3>
          <input
            type="text"
            value = {newname}
            id="deck-name"
            onChange={(e)=>{setNewName(e.target.value)}}
            placeholder=""
          />
          <button id='card-name-save' onClick={handledecknamechange}>Save</button>   
        </div>
      }

      {addclosed && !practicing &&
      <div>
        <div id="view-deck-cards">
          {currData.map((json, index)=>(
            <Card key={index} dbjson={json} datatype={typeList[index]} infojson={infoList[index]} toggleRemove={toggleRemove} removesize={removesize}/>
          ))}
        </div>
        <p>Count : {cardcount}</p>
        <div id="deck-practice-selector">
          <button onClick={()=>setClosed(true)} id="menu-button">
            Exit to menu
          </button>
          {(countChars() > 0 && removesize === 0) && 
          <div>
            <button onClick={()=>handlePractice("pwt")} id="menu-practice-button">
              Practice Pronunciations with tones
            </button>
            <button onClick={()=>handlePractice("prt")} id="menu-practice-button">
              Practice Pronunciations without tones
            </button>
          </div>
          }
          {removesize > 0 && 
          <div>
            <button onClick={()=>undoRemove()} id="menu-button" style={{backgroundColor: "rgb(32, 216, 47)", color:"white"}}>
              Undo All
            </button>
            <button onClick={()=>removeCards()} id="menu-button" style={{backgroundColor: "rgb(255, 53, 53)", color:"white"}}>
              Delete {removesize } card{removesize === 1 ? "":"s"}
            </button>
          </div>
          }
          {removesize === 0 &&
          <button onClick={()=>handlePractice("def")} id="menu-practice-button">
            Practice Definitions for all cards 
          </button>
          }
          <button onClick={()=>setAddclosed(false)} id="menu-button">
            Add Card
          </button>
        </div>
        <p>Pronunciation can only be practiced for cards that are single characters (字). Check out the learn page for what constitutes a single character</p>
      </div>
      }
      {practicing && 
        <div>
          {(practiceType === "prt" || practiceType === "pwt") ?
            <PracticeCardPronunciation infojsons={infoList} typelist={typeList} test_type={practiceType} setPracticing={setPracticing}/> 
            :
            <PracticeCardDefinition infojsons={infoList} typelist={typeList} test_type={practiceType} setPracticing={setPracticing}/> 
          }
        </div>
      }
      {!addclosed &&
        <AddDeck defaultdeckname={data[0]} contained={infoList} refresh={refresh}/>
      }
    </div>
  )
}

//main component shown at the home flashcards page, under flashcards.
function Deck({data, setDeckCount, setClosed, setAltcomp}) {
  const {userlogin, removedeck} = useUser()
  const [removeTriggered, setRemoveTriggered] = useState(false)
  const navigate = useNavigate() //navigate
  const queryClient = useQueryClient()
  //display if details are being shown
  const handleRemove = () => {
    setRemoveTriggered(true)
    //confirm with user
    const confirmed = window.confirm(`Are you sure you want to delete this deck, ${data[0]}`);
    if(confirmed) {
      removedeck(userlogin.uid, data[0])
      setDeckCount(prev=>prev-1) //decrement 
      queryClient.invalidateQueries(["cards"])
    } else {
      setClosed(true) //hide the card deck
      setAltcomp(null)
      return
    }
  }
  //handle when function is called to show details
  const handleDetails = () =>{
    if (!removeTriggered) {
      setClosed(false) //expose the card deck
      setAltcomp(<DeckCards data={data} setClosed={setClosed} setAltcomp={setAltcomp}/>)
    } else {
      return
    }
  }
  
  return (
    <div className="deck" onClick={handleDetails}>
      <button id="goto-deck" >
      <h2>{data[0]}</h2>
      <h4>{data[1].length} Cards</h4>
      </button>
    </div>
  )
}

//add deck component: display list of characters with button (default parameter for when the deckname is fixed). setDeckCount to empty when do deck is added, but we are trying to add to a deck
function AddDeck({setDeckCount=()=>{}, defaultdeckname = null, contained=[], refresh=()=>{}}) {   
  const [deckname, setDeckname] = useState("")
  const [showdecknameinput, setShowdecknameinput] = useState(true) //set if deckname input is shown
  const [charType, setCharType] = useState("Trad")  
  const [dataType, setDataType] = useState("characters")
  const [isSet, setisSet] = useState(false) //check if the name has been set yet
  const [count, setCount] = useState(0)//count of cards added 
  const [addmap, setAddmap] = useState(new Map())//map to store information of about cards to adds
  const {cardsmap, isFetching, removecard, addcard, rawcards} = useUser()
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
      alert("deck name must but not be empty")
    } else if (cardsmap.has(deckname.trim())) {
      alert("deck name must but be unique, try again")
      setDeckname("") //reset the string
    } else {
      setisSet(true)
    }
  }
  //function to add or remove from the add map based on the datasent
  const toggleAdd = (data, checked) =>{
    const {user_id,idx, deck_name, data_type, char_type} = data//destructure
    const key = `${idx}-${data_type}-${char_type}` //get key
    if (checked) { //remove path call if it is checked and not fixed 
      const copy = addmap//remove from map
      copy.delete(key)
      setAddmap(copy)
      setCount(prev=>prev-1)
    } else { //addcard call
      const copy = addmap//remove from map
      copy.set(key,data)
      setAddmap(copy)
      setCount(prev=>prev+1)
    }
  }
  //handle clicking submit for a character type
  const handleClick = (newCharType, newDataType) => {
    setCharType(newCharType)//set values
    setDataType(newDataType)  
  }
  //function to handle save
  const handleSave = () => {
    //iterate through map and save all data
    const newcarddata = []///list of new datajoins
    for (const key of addmap.keys()) {
      const data = addmap.get(key)
      newcarddata.push(data)
      const {user_id,idx, deck_name, data_type, char_type} = data
      addcard(user_id,idx, deck_name, data_type, char_type)
    }
    queryClient.invalidateQueries(["cards"])
    while (isFetching) {} 
    refresh(newcarddata)//call refresh function if any with the provided data
    setDeckCount(prev=>prev+1) //increment number of decks
  }

  return (
    <div>
      {showdecknameinput && 
      <div>
        <h3>Select a Name</h3>
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
      <h3>Add cards to the deck from the list of characters</h3>
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
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
          <tbody>{Object.entries(tradchar).map((Json,i) => (
            <CharDetailsRow key={i} charJson={Json[1]} index={Json[0]} deckname={deckname} toggleAdd={toggleAdd} contained={contained}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="characters")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
          <tbody>{Object.entries(simpchar).map((Json,i) => (
            <CharDetailsRow key={i} charJson={Json[1]} index={Json[0]} deckname={deckname} toggleAdd={toggleAdd} contained={contained}/>
          ))}</tbody>        
        </table>
        <table class="char_table" hidden={!(charType=="Trad" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
          <tbody>{Object.entries(tradword).map((Json,i) => (
            <DefDetailsRow key={i} charJson={Json[1]} index={Json[0]} deckname={deckname} toggleAdd={toggleAdd} contained={contained}/>
          ))}</tbody>
        </table>
        <table class="char_table" hidden={!(charType=="Simp" && dataType=="words")}>
          <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th><th>index</th></tr></thead>
          <tbody>{Object.entries(simpword).map((Json,i) => (
            <DefDetailsRow key={i} charJson={Json[1]} index={Json[0]} deckname={deckname} toggleAdd={toggleAdd} contained={contained}/>
          ))}</tbody>
        </table>
      </div>}
    </div>
  )        
}
//Special add deck component (allows adding to any deck, given a list of json, used to add to cards after a practice session and missed cards)
export function PracticeAddDeck({dataType, mainjson}) {   
  const navigate = useNavigate()
  const {userlogin} = useUser();
  const [decks, setDecks] = useState(new Map()) //get decks map
  const [deckname, setDeckname] = useState("") //current selected deckname
  const [inputdeckname, setInputdeckname] = useState("") //current deckname typed if any
  const [isSet, setisSet] = useState(false) //check if the name has been set yet
  const [contained, setContained] = useState([])//list of jsons contained (the jsons in each deck)
  const [deckcount, setDeckCount] = useState(0)//count the number of decks
  const [addmap, setAddmap] = useState(new Map())//map to store information of about cards to adds
  const [addcount, setAddcount] = useState(new Map())//count of cards to add (for display purposes only)
  const {cardsmap, isFetching, removecard, addcard} = useUser()
  const queryClient = useQueryClient()

  useEffect(() => {
    //if user is logged, in set to the actual data
    if(cardsmap) {
      setDecks(cardsmap)
      setDeckCount(cardsmap.size)
    }
  }, [])

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
  //function to add or remove from the add map based on the datasent
  const toggleAdd = (data, checked) =>{
    const {user_id, idx, deck_name, data_type, char_type} = data//destructure
    const key = `${idx}-${data_type}-${char_type}` //get key
    if (checked) { //remove map key call if it is checked and not fixed 
      const copy = addmap//remove from map
      copy.delete(key)
      setAddmap(copy)
      setAddcount(copy.size) //ensures rerendering size
    } else { //addcard call
      const copy = addmap//remove from map
      copy.set(key,data)
      setAddmap(copy)
      setAddcount(copy.size) //ensures rerendering size
    }
  }
  //remove all listed cards from the list of added cards 
  const addAll = () =>{     
    const copy = addmap//add to the current map
    for(const json of mainjson) {
      const idx = findIndex(json)
      const data_type = dataType==="words" ? "W":"C"
      const char_type = json["code"]
      const data = {user_id : userlogin.uid, idx:idx, deck_name : deckname, data_type:data_type, char_type:json["code"]}//destructure
      const key = `${idx}-${data_type}-${char_type}` //get key
      copy.set(key,data)
      setAddmap(copy)
      setAddcount(copy.size) //ensures rerendering size
    }
    const maincopy = mainjson
    mainjson = maincopy
  }
  //remove all listed cards from the list of added cards 
  const removeAll = () =>{     
    setAddmap(new Map())
    setAddcount(0) //ensures rerendering size
  }

  //function to handle save-calls the backend
  const handleSave = () => {
    //iterate through map and save all data
    const newcarddata = []///list of new datajoins
    for (const key of addmap.keys()) {
      const data = addmap.get(key)
      newcarddata.push(data)
      const {user_id,idx, deck_name, data_type, char_type} = data
      addcard(user_id,idx, deck_name, data_type, char_type)
    }
    queryClient.invalidateQueries(["cards"])
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
      <h3>{deckcount > 0? "Select a deck or create a new one": "Get started by creating a deck"}</h3>
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
      {/*must pass add map so colors change dynamically, forcing rerender*/}
      {isSet &&
      <div> 
      <h3>Add cards to the deck selected, {deckname}, from the list of characters missed</h3>
      <div id="addchars-show">
        {addcount !== mainjson.length ? 
          <button id="add-all-cards" onClick={addAll}>Add all</button> 
          :
          <button id="remove-all-cards" onClick={removeAll}>Remove All</button>
        }
        <button id="save-cards" onClick={handleSave}>
          <p>{addcount > 0 ? `Cards added: ${addcount}, Save and Exit`
          : "No cards added, Save and Exit?"}</p>
        </button>

      </div>
        {addcount != 0 &&
        <div>
          <table class="char_table" hidden={!(dataType==="characters")}>
            <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
            <tbody>{mainjson.map((Json,i) => (
              <CharDetailsRow key={i} charJson={Json} index={findIndex(Json)} deckname={deckname} toggleAdd={toggleAdd} contained={contained} initial_checked={addcount==mainjson.length}/> 
            ))}</tbody>        
          </table>
          <table class="char_table" hidden={!(dataType==="words")}>
            <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th></tr></thead>
            <tbody>{mainjson.map((Json,i) => (
              <DefDetailsRow key={i} charJson={Json} index={findIndex(Json)} deckname={deckname} toggleAdd={toggleAdd} contained={contained} initial_checked={addcount==mainjson.length}/>
            ))}</tbody>
          </table>
        </div>}
        {addcount == 0 &&
        <div>
          <table class="char_table" hidden={!(dataType==="characters")}>
            <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>full pronunciation</th><th>difficulty category</th></tr></thead>
            <tbody>{mainjson.map((Json,i) => (
              <CharDetailsRow key={i} charJson={Json} index={findIndex(Json)} deckname={deckname} toggleAdd={toggleAdd} contained={contained} initial_checked={false}/> 
            ))}</tbody>        
          </table>
          <table class="char_table" hidden={!(dataType==="words")}>
            <thead><tr><th>+/-</th><th>word/character</th><th>full definition</th><th>difficulty category</th></tr></thead>
            <tbody>{mainjson.map((Json,i) => (
              <DefDetailsRow key={i} charJson={Json} index={findIndex(Json)} deckname={deckname} toggleAdd={toggleAdd} contained={contained} initial_checked={false}/>
            ))}</tbody>
          </table>
        </div>}
      </div>
      }
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

//components to display multiple flashcard decks. Renders, potentially, multiple deck components
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
  const refresh = (newcarddata) => {
    setAltclosed(true)
  }

  //function to add a deck
  const handleAddDeck = () => {
    if (deckcount === 5) {
      alert("cannot create more than 5 decks with your account") //5 flashcard deck limit
    } else {
      setAltclosed(false)
      //prepare test data
      setAltcomp(<AddDeck refresh={refresh} setDeckCount={setDeckCount}/>)//set the component to show the add cards component 
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
          <button className="add-deck" onClick={handleAddDeck}>
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