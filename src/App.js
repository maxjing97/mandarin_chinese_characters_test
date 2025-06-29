import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Characters from './pages/mainchars';
import Words from './pages/mainwords';
import PracticePronunciation from './pages/practicechars';
import PracticeDefinition from "./pages/practicedefs"
import {About, Resources} from './pages/more';
import {CharList} from "./pages/list"

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
        <Route path="/practice_char_pronunciation"  element={<PracticePronunciation/>} />
        <Route path="/practice_char_definition"  element={<PracticeDefinition/>} />
      {/*routes for the more page*/}
      <Route path="/resources"  element={<Resources />}/>
      <Route path="/about"  element={<About />}/>

      <Route path="/charlist"  element={<CharList />}/>
      <Route path="/wordlist"  element={<CharList />}/>
    </Routes>
    </div>
    </>
  );
}

export default App;