import "./accounts_cards.css"
import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../context/auth"
import { useUser } from "../context/userContext";

//components to display flashcards
export default function Flashcards() { 
  return (
    <div className="about_main"> 
      <h2>My Flashcards</h2>
    </div>
  );
}
