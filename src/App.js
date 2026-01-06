import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './pages/navbar';
import Characters from './pages/mainchars';
import Words from './pages/mainwords';
import PracticeCharPronunciation from './pages/practicecharspros';
import PracticeCharDefinition from "./pages/practicecharsdefs";
import PracticeCardDefinition from "./pages/practicecardsdefs"
import PracticeCardPronunciation from "./pages/practicecardspros"
import {Entry, About, Resources} from './pages/more';
import {CharList, WordList} from "./pages/list"
import {Account} from "./pages/account"
import UserProvider from "./context/userContext"
import{QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Flashcards from './pages/flashcards';
const queryClient = new QueryClient() //log the query client to be used
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Navbar/>
          <div>
        <Routes>        {/*defining routes */}
          <Route path="/"  element={<Words/>} />{/*default page route */}
          <Route path="/flashcards" element={<Flashcards/>} />{/*visible after login only: main flashcard selection paths*/}
          <Route path="/flashcards-definition" element={<PracticeCardDefinition/>} />{/*visible after login only: main flashcard selection paths*/}
          <Route path="/flashcards-pronunciation" element={<PracticeCardPronunciation/>} />{/*visible after login only: main flashcard selection paths*/}
          {/*practice pages and account */}
          <Route path="/account"  element={<Account/>} />
          <Route path="/words"  element={<Words/>} />
          <Route path="/characters"  element={<Characters/>} />
            {/*defining routes within the practice page*/}
            <Route path="/practice_char_pronunciation"  element={<PracticeCharPronunciation/>} />
            <Route path="/practice_char_definition"  element={<PracticeCharDefinition/>} />
          {/*routes for the more page*/}
          <Route path="/resources"  element={<Resources />}/>
          <Route path="/about"  element={<About />}/>
          {/*Links for learning more*/}
          <Route path="/learn"  element={<Entry />}/>
          <Route path="/charlist"  element={<CharList />}/>
          <Route path="/wordlist"  element={<WordList />}/>
        </Routes>
        </div>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;