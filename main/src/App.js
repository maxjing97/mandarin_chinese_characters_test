import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Characters from './pages/main';
import {PracticePronunciation} from './pages/practice';
import {About, Resources} from './pages/more';

function App() {
  return (
   <>
    <Navbar/>
      <div>
    <Routes>        {/*defining routes */}
      {/*practice pages */}
      <Route path="/characters"  element={<Characters/>} />
        {/*defining routes within the practice page*/}
        <Route path="/practice_pronunciation"  element={<PracticePronunciation/>} />
        <Route path="/practice_definition"  element={<PracticePronunciation/>} />
      {/*routes for the more page*/}
      <Route path="/resources"  element={<Resources />}/>
      <Route path="/about"  element={<About />}/>

      

    </Routes>
    </div>
    </>
  );
}

export default App;