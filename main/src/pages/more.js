import React from 'react';

export function About() {
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>About</h1>
      <p>This is a project to create a flashcards app that also assigns in learning chinese by having characters ranked in a frequency order</p>
      <p>This tool is likely most helpful to people wanting to practice their character and mandarin pronunciation comprehension who are at an intermediateto early advanced
       level of chinese. The character list contains ~2600 to practice, and the dictionary contains around ~10000 total words that are are combination of these characters.
    
      
      The original ranking is based on a <a href="http://www.mementoslangues.fr/Chinois/Sinogrammes/Table3000CaracteresChinois.pdf">linked pdf </a>
      here. 

      Edits were made with additional resources <br></br><br></br>

      This is an open source project with the <a href="https://github.com/maxjing97/mandarin_chinese_characters_test">github link</a> here.    
      

      </p>

    </div>
  );
}

export function Resources() {
  return (
    <div className="about_main" style={styles.about_main}> 
      <h1 className='stats-title'>More Resources</h1>
      <p>
        <p>Additional recommended resources are here</p>
         
        <a href="https://en.wikipedia.org/wiki/Debate_on_traditional_and_simplified_Chinese_characters">Link</a> to wikipedia for differences between simplified and traditional characters
        
        <p style={styles.wikidicttext}>Access Wiktionary Below (good for understanding the origin of characters), great general dictionary for Chinese</p>
        <iframe title="report" style={styles.wikidict} src="https://en.wiktionary.org/wiki/%E4%B8%AD"></iframe>


      </p>

    </div>
  );
}

const styles = {
  about_main: {
    padding: "10px 200px",
    fontSize: "16px",
    color: "black"
  },
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