import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Characters from './pages/mainchars';
import Words from './pages/mainwords';
import PracticeCharPronunciation from './pages/practicecharspros';
import PracticeCharDefinition from "./pages/practicecharsdefs";
import PracticeWordDefinition from "./pages/practiceworddefs";
import {About, Resources} from './pages/more';
import {CharList, WordList} from "./pages/list"

function App() {
  return (
   <>
    <Navbar/>
      <div>
    <Routes>        {/*defining routes */}
      {/*practice pages */}
      <Route path="/characters"  element={<Characters/>} />
      <Route path="/words"  element={<Words/>} />
        {/*defining routes within the practice page*/}
        <Route path="/practice_char_pronunciation"  element={<PracticeCharPronunciation/>} />
        <Route path="/practice_char_definition"  element={<PracticeCharDefinition/>} />

        <Route path="/practice_word_definition"  element={<PracticeWordDefinition/>} />
      {/*routes for the more page*/}
      <Route path="/resources"  element={<Resources />}/>
      <Route path="/about"  element={<About />}/>

      <Route path="/charlist"  element={<CharList />}/>
      <Route path="/wordlist"  element={<WordList />}/>
    </Routes>
    </div>
    </>
  );
}

export default App;