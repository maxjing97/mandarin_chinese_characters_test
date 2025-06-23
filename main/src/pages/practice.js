import './practice.css';
import React, { Component, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tradchar from './data/tradchars.json'; //import json fo 
import simpchar from './data/simpchars.json'; //import json 
//add component to display the challenge

//lists of the words corresponding to the images in the order
// sorted in folders for each of the image lists
const listA = ["lantern", "valley","spoon", "lightning", "puzzle",
 "carpet","robot","mirror", "volcano","guitar"]

const listB = ["forest", "castle","ladder", "notebook", "candle",
        "anchor","helmet","river", "statue","clock"]

const listC = ["train", "feather","coins", "whale", "telescope",
        "compass","dragon","fountain", "diamond","mask"] 

//function to randomly select a word list with its name and corresponding image list, and a randomly selected irrelevant word list
function randomWordList() {
  //randomly select a list to use
  const list_names = ["A","B","C"] 
  const list_chosen = list_names[Math.floor(Math.random() * list_names.length)];
  //get the correspoding words in order
  let word_list = []
  let irrelevant_list = [] //word list of excluded words to include in the list of 10 irrelevant words to be randomly chosen
  switch(list_chosen) {
    case "A":
      word_list = listA
      irrelevant_list = listB.concat(listC)
      break;
    case "B":
      word_list = listB
      irrelevant_list = listA.concat(listC)
      break;
    case "C":
      word_list = listC
      irrelevant_list = listA.concat(listB)
      break;
  }
  
  //randomly select 10 from the list 
  let irrelevant_words = new Set()
  while (irrelevant_words.size < 10) {
    const random = irrelevant_list[Math.floor(Math.random()*irrelevant_list.length)]
    irrelevant_words.add(random)
  }
  irrelevant_words = Array.from(irrelevant_words) //convert to list

  let image_paths = [] //get image paths
  for(let i = 1; i <= 10; i++) {
    image_paths.push(`../test_images/list${list_chosen}/${String(i)}.png`)
  }

  //shuffle the word_list and image paths randomly:
  const result = [...word_list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // Swap elements
    [image_paths[i], image_paths[j]] = [image_paths[j], image_paths[i]]; // Swap elements
  }
  word_list = result

  return [image_paths, word_list, irrelevant_words ]
}

//child component 1: display Text
const TextDisplay = ({ text, imageUrl}) => {
  return (
    <div className="img_container">
      <div className="img_text">{text}</div>
      <img src={imageUrl} alt="Should Not" className="image"/>
    </div>
  );
};

//child component 2: display text and more for the text input
const TextInput = () => {
  return (
    <div>
      <div className="img_text">Type the Pinyin</div>
    </div>
  );
};
//child component 3: component to display the final results and connect to a database to store them
const Results = ({data, time_limit}) => {
  const a1 = data.slice(0,10).reduce((a,b)=>a+b,0) //compute accuracy for condition 1 (sum elements from 1 to 10), then divide by 10 
  const a2 = data.slice(10,20).reduce((a,b)=>a+b,0) //compute accuracy for condition 2
  const a3 = data.slice(20,30).reduce((a,b)=>a+b,0) //compute accuracy for condition 3
  //compute total accuracy
  const total = data.slice(0, 30).reduce((a,b)=>a+b,0)
  

  useEffect(()=>{
    return () => {} 
  }, []) //call only once on mount
  
  return (
    <div>
      <h2>Results Page</h2>
      <h3>Here are results of your memory test:</h3>
      <p>Accuracy when shown a relevant image + word {a1*10}%</p>
      <p>Accuracy when shown a no image + word {a2*10}%</p>
      <p>Accuracy when shown an irrelevant image + word {a3*10}%</p>
      <p>total accuracy: {Math.floor(total/30*100)}% or {total} correct</p>
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
      console.log("ran in range:")
      retjsonlist.push(json)
    }
  }
  //console.log(JSON.stringify(retjsonlist))
  //select numtest unique json objects from this
  //randomly select 10 from the list 
  let new_random_chars = new Set()
  while (new_random_chars.size < numtest) {
    const random = retjsonlist[Math.floor(Math.random()*retjsonlist.length)] //select from our current list 
    new_random_chars.add(random)
  }
  new_random_chars = Array.from(new_random_chars) //convert to list
  return new_random_chars 
}

//function to get the pronunciation components, and the list of correct values 
//range is a list of highest to 
function getComponents(bottom, top , num_test, character_type, test_type, practice_type) { 
  const componentsList = [];
  const correctvals = [];
  const jsonlist = getJsons(bottom, top,num_test,practice_type, character_type)//get the proper list of subjson
  //iterate to create components
  //based on the test type: isolate the key for the correct value to test the user on
  let test_key = "" ?
  if (test_type=="def") {

  }

  for (const json in jsonlist) {

  }

  return [componentsList, correctvals]
}

////tracks accuracy of all words 30 for now, every 10 different conditions
let accuracies = Array(30).fill(0)
const [components, word_list] = getComponents() //get list of current components, word list
export function PracticePronunciation(props) { //main parent image component (to avoid remounts when changing child components shown)
  const navigate = useNavigate();
  const location = useLocation();
  //get destructured data
  const { range, num_test, character_type, test_type, practice_type} = location.state 
  
  const [componentList, setComponentList] = useState(components)//store the fixed list of components 
  const [index, setIndex] = useState(0); //this index is key, cycling through through all words (60 for now 2 for ach)
  const [isText, setIsText] = useState(0); //states weather we access the first (image) or second(text) component in our current 2-element component
  const [text, setText] = useState(''); //set text in the input box
  const [nextText, setnextText] = useState("Skip to test ➡");//text to display in the next button
  const timeoutTime = Math.floor(parseFloat(props.time) * 1000) //calculate ms to allow the user to see the image
  
  const inputRef = useRef(null); //use to focus cursor. UseRef hooks create object that lasts through renders, and modifying does not trigger a re-render
  
  // This effect will only run once after the component mounts. user this to get the necessary data
  useEffect(() => {
    const componentLists = getComponents(range[0], range[1], num_test, character_type, test_type, practice_type) //pass range as a shallow object
    setComponentList(componentLists)
  }, []); 


  //calculate counts of correct values
  const getAccuracies = () => {
    const a1 = accuracies.slice(0,10).reduce((a,b)=>a+b,0) //compute accuracy for condition 1 (sum elements from 1 to 10), then divide by 10 
    const a2 = accuracies.slice(10,20).reduce((a,b)=>a+b,0) //compute accuracy for condition 2
    const a3 = accuracies.slice(20,30).reduce((a,b)=>a+b,0) //compute accuracy for condition 3
    return [a1, a2, a3]
  }



  const nextSection = () => { 
    //if isText is 0, this is an image one, so we move to a text one (so we stay on the same word)
    if (isText == 0 && index < 59) {
      setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
      setIsText(1); //move to the text section 
      setnextText("Don't Remember? Try the Next Word ➡")
    } else if (isText == 1 && index < 59) { //in this case, the user has skipped the section, so record the accuracy as 0 for this, while moving on to the next image to test
      setIsText(0); //move to the image section 
      setIndex((prev) => (prev + 1)); //go to the next one as long as the end has not been reached
      setnextText("Skip to test ➡")//set the appropriate text for the button
      setText("")//when the skip button is clicked, reset the value of the text input box
      //update component list to the next index since state changes in React do not apply immediately, being applied by the next render cycle
    } else {
      //when we have reached the end, only display the results page: reset component list, and send the data, calculating accuracies
      const [a1, a2, a3] = getAccuracies()
      console.log(a1+","+a2 +","+a3)//lim, cond, accuracy,correct_count
      setIndex(0);
      setIsText(0);
      setComponentList([<Results data={accuracies} time_limit={props.time}/>])
    }
  }

  //function used to handle changes in the text input box
  const handleTextChange = (e) => {
    setText(e.target.value) //set the text value dynamically
    const value = e.target.value;
    const targetWord = word_list[(index-1)/2] //get the target for based on the for index
    if (value.trim().toLowerCase() === targetWord.toLowerCase()) {
      setText("") //reset if there is match
      accuracies[(index-1)/2] = 1 //find the correponding accuracy index to change
      nextSection() //more to the next one
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

  return (
    <div className="all">
      <h3>Try to type the pronuciation ({test_type === "prt"? "without": "with"} tone) for {num_test} characters</h3>

      <div className="text_container">
        {/* render all components with varying visiblity to avoid unmounting, destroying vital state variables. Renders components in order*/}
        {componentList.map((Component, i) => (
          <div key={i} style={{ display: index === (i) ? 'block' : 'none' }}>
            {Component}
          </div>
        ))}

        {/* button for inputting text-display only if is text is odd*/}
        
        <div style={{ display: (isText === 1) ? 'block' : 'none' }}>
          <div className="text_wrapper">
            <input
              type="text"
              value = {text}
              ref={inputRef}
              onChange={handleTextChange}
              placeholder="Start typing..."
              style={styles.text_input}
            />
          </div>
        </div>

        <p style={{display: componentList.length !== 1 ? 'block' : 'none' }}>Word {Math.floor(index/2)} of {num_test} total</p> 
      </div>

      <button onClick={nextSection} style={{...styles.skip, ...{display: componentList.length != 1 ? 'block' : 'none' }}}>{nextText}</button> {/* skip function inherted from parent component (display only the number of components is not 0)*/}
      <button onClick={menuExit} className="back">
      ⬅ Back to Menu
      </button>
    </div>
  );
};

//addition styles for a component that needs to chnage style oftenL, the next page
const styles = {
  skip: {
    backgroundColor: '#44e02f',     // vibrant red
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
