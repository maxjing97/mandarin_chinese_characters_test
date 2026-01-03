import "./more.css"
import React from 'react';
import {Link, useNavigate} from "react-router-dom"

export function Entry() { //entry function allowing more information to be found out
  return (
    <header className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>Learning and Resources</h1>
      <h3>Start becoming proficient in reading Mandarin!</h3>
      <h2>More Learning Resources here!</h2>

      <Link to="/charlist"><h2 className="list_link">Tested Single-Characters(字) List</h2></Link>  
      <Link to="/wordlist"><h2 className="list_link">Tested Multi-Character Words(詞) List</h2></Link> 
      <Link to="/resources"><h2 className="list_link">Wiktionary and more Resources</h2> </Link> 
    </header>
  );
}

export function About() {
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>About</h1>
      <h3>Start becoming proficient in reading Mandarin!</h3>
      <h2>practice and learn now!</h2>

      <p>This is a project to create a flashcard app that also assigns in learning chinese by having characters ranked in a frequency order</p>
      <p>This tool is likely most helpful to people wanting to practice their character and mandarin pronunciation comprehension who are at an intermediate to early advanced
       level of chinese. The character list contains ~2600 to practice, and the dictionary contains around ~10000 total words that are are combination of these characters.
    
      
      The original ranking is based on a <a href="http://www.mementoslangues.fr/Chinois/Sinogrammes/Table3000CaracteresChinois.pdf">linked pdf </a>
      here. 

      Edits were made with additional resources <br></br><br></br>

      This is an open source project with the <a href="https://github.com/maxjing97/mandarin_chinese_characters_test">github link</a> here.<br></br>
      
      Contact maxjing97@gmail for support or questions. 
      </p>

    </div>
  );
}

export function Resources() {
  const navigate = useNavigate();

  return (
    <header className="about_main" style={styles.about_main}> 
      <button onClick={()=>navigate("/learn")} className="back_to_learn">⏴ Learning Menu</button>
      <h1 className='stats-title'>Wiktionary and more Resources</h1>
      <p>
        <p id="wikidicttext">Access Wiktionary Below (good for understanding the origin of characters), great general dictionary for Chinese</p>
        <iframe title="report" id="wikidict" src="https://en.wiktionary.org/wiki/%E4%B8%AD"></iframe>
        <p>Additional recommended resources are here</p>
        <a href="https://en.wikipedia.org/wiki/Debate_on_traditional_and_simplified_Chinese_characters">Link</a> to wikipedia for differences between simplified and traditional characters

      </p>

    </header>
  );
}

const styles = {
  wikidict: {
    width: "100%",       /* full container width */
    height: "700px",     /* or any fixed/relative value */
    position: "relative",/* ensures child 100% height works */
  },
  wikidicttext: {
    fontSize: "20px",
    fontWeight: "bold",
  }
}