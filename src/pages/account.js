import "./accounts_cards.css"
import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../context/auth"
import { useUser } from "../context/userContext";
import Flashcards from "./flashcards";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';


//create components for entering password, register, reset password, and component to show flashcards review
function Login({onPasswordEnter, change}) { //handler password
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)//tell if password should be shown
  const buttonref = useRef(null) //focus on the login button
  return (
    <div className="account"> 
      <div>
        <h2>Login:</h2>
        <h3>Enter Email</h3>
        <input
          type="text"
          value = {email}
          className="account_text_input"
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
        />
        <h3>Enter Password</h3>
        <div className="password_input">
          <input
            type={showPassword ? 'text' : 'password'}
            value = {password}
            className="account_text_input"
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            type="button"
            id="show_password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
          {showPassword ? 
          <img className="password-icon" src="/media/hide_pass.png" alt="hide password"/> 
          : <img className="password-icon" src="/media/show_pass.png" alt="show password"/>}
          </button>
        </div>
        
        <div className="submit_section">
          <button className="account_submit_button" ref={buttonref} onClick={()=>onPasswordEnter(email, password)}>Login</button>
          <button className="account_change_button" onClick={()=>change(1)}>Register</button>

          <button className="password-reset" onClick={()=>change(2)}>Forgot your password?</button>
        </div>

        <p>Login or create a count to create 5 flashcards decks to practice</p>
      </div>
    </div>
  );
}

function Register({change}) { //handler for the registration
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [sent, setSent] = useState(false)//tell if password should be shown
  const [showPassword, setShowPassword] = useState(false)//tell if password should be shown
  //use firebase to send an email
  const handleRegistration = async() => {
    //check if the two passwords match
    if(password!==password2) {
      alert("The two entered passwords do not match")
      return
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); //create the user
        const user = userCredential.user;
        await sendEmailVerification(user); //send email verifcation
        setSent(true)
        alert('Verify your email, and then return to login');
    } catch (error) {
        alert('Check if the email entered is correct:'+error.message);
    }
  };
  
  return (
    <div className="account"> 
      <div>
        <h2>Register an Account to Start Saving Flashcards:</h2>
        {!sent && (
        <div>
          <h3>Enter Email</h3>
          <input
            type="text"
            value = {email}
            className="account_text_input"
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
          />
          <h3>Enter Password</h3>
          <div className="password_input">
            <input
              type={showPassword ? 'text' : 'password'}
              value = {password}
              className="account_text_input"
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              id="show_password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
            {showPassword ? 
            <img className="password-icon" src="/media/hide_pass.png" alt="hide password"/> 
            : <img className="password-icon" src="/media/show_pass.png" alt="show password"/>}
            </button>
          </div>
          <h3>Confirm Password</h3>
          <div className="password_input">
            <input
              type='password'
              value = {password2}
              className="account_text_input"
              onChange={(e)=>setPassword2(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="submit_section">
            <button className="account_submit_button" onClick={()=>handleRegistration()}>Register</button>
          </div> 

        </div>
        )}
        <div className="submit_section">
          <button className="account_change_button" onClick={()=>change(0)}>Return To login</button>
        </div> 
      </div>
    </div>
  );
}

function Reset({change}) { //handler password
  const [email, setEmail] = useState()
  const [sent, setSent] = useState(false)//tell if password should be shown
  //use firebase to send an email
  const handleReset = async () => {
    try {
        await sendPasswordResetEmail(auth, email);
        setSent(true)
        alert('Email sent to reset the password for you account, follow the instructions and return to login');
    } catch (error) {
        alert('Check if the email entered is correct:'+error.message);
    }
  };
  
  return (
    <div className="account"> 
      <div>
        <h2>Reset Email Here</h2>
        <h3>Enter your email, a link will be sent to reset the password</h3>
        {!sent && (
          <input
            type="email"
            value = {email}
            className="account_text_input"
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
          />
        )}
        
        <div className="submit_section">
          {!sent && (
            <button className="account_submit_button" onClick={()=>handleReset()}>Reset</button> 
          )}
          <button className="account_change_button" onClick={()=>change(0)}>Back to Login</button>
        </div>
        
      </div>
    </div>
  );
}

export function Account() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0) //index of components to show
  const {userlogin} = useUser()//get user info 
  //if the user is logged in, set into to 4 immediately
  useEffect(()=>{
    if (userlogin) {
      navigate("/flashcards") //if user is already logged in, redirect to flashcards
    }
  })

  //handle login,logout is handled in the nav bar
  const handlelogin = async(email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/flashcards")//if no errors, go to flashcards
    } catch (error) {
      let message = 'Login failed. Please try again, with error: '+String(error);
      if (String(error).includes("invalid-email")) {
        message = "Please create an account."
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      }
      alert(message);
    }
  }

  //get components list 
  const compList = [<Login onPasswordEnter={handlelogin} change={setIndex}/>, 
                    <Register change={setIndex}/>, <Reset change={setIndex}/>]
  return (
    <div id="accounts-all">
      <h1 className='stats-title'>Account</h1>
      {compList[index]}
    </div>
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