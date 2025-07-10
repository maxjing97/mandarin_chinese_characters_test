import "./accounts_cards.css"
import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../context/auth"
import { useUser } from "../context/userContext";


//components to display the flash card preview
export default function Flashcards() { 
  const navigate = useNavigate();
  const {userlogin, rawcards} = useUser()

  return (
    <div className="about_main"> 
      <h2>My Flashcards</h2>
      <h5>Test: {userlogin.uid}</h5>
    </div>
  );
}
