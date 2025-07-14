import { createContext, useContext, useEffect, useState } from "react";
import { auth  } from "./auth"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

//API  based on if the environment is dev or production
const API_URL = (process.env.NODE_ENV === 'development') ? "http://localhost:2008" : ""

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
export default function UserProvider ({children}) {
    const queryClient = useQueryClient();
    const [userlogin, setUserlogin] = useState(null); //context variable to check if a user is logged in
    const [cardsmap, setCardsmap] = useState(new Map()); //map from deck name to a list of json 

    //function to get raw data 
    const processrawdata = (rawdata) => {
        //iterate through json of the list 
        //get set of names
        const currmap = new Map()
        for (const json of rawdata) {
            const currdeck = json["deck_name"]
            if(currmap.has(currdeck)) { //check if the map already has the key
                const currlist = currmap.get(currdeck)
                currlist.push(json)
                currmap.set(currdeck, currlist)
            } else {
                currmap.set(currdeck, [json])
            }
        }
        setCardsmap(currmap)
        return 
    }

    //async function to get data based on user id in userlogin (uid)
    const fetchRawcards = async() => {
        const send_data = {
            user_id: userlogin.uid
        }
        const response= await fetch(`${API_URL}/get-all-data`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(send_data)
        })
        const resdata = await response.json() //get response data
        //if not ok, return error 
        if(!response.ok) {
            return
        } else {
            //otherwise, get the json data, and set the processed map
            processrawdata(resdata)
            return resdata
        }
    }
    //function to add data 
    //functions to add and remove card
    const addcard = async(uid, index, deckname, datatype, chartype) => {
      try {
        //get user id
        const send_data = { 
          user_id:uid, 
          idx:index, 
          deck_name:deckname, 
          data_type:datatype, 
          char_type:chartype,
        }
        const response = await fetch(`${API_URL}/add-data`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(send_data)
        })
        const resdata = await response.json() //get response data
        if(!response.ok) {
            console.log("server issues when adding data", resdata)
            return 
        } else {
            return resdata
        }
    
      } catch {
        console.error("unknown issues when trying to add data")
      }
    }
    //remove a card from a deck
    const removecard = async(uid, index, deckname, datatype, chartype) => {
      try {
        //get user id
        const send_data = { 
          user_id:uid, 
          idx:index, 
          deck_name:deckname, 
          data_type:datatype, 
          char_type:chartype,
        }
        const response = await fetch(`${API_URL}/delete-card`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(send_data)
        })
        const resdata = await response.json() //get response data
        if(!response.ok) {
            console.log("server issues when adding data", resdata)
            return 
        } else {
            return resdata
        }
      } catch {
        console.error("unknown issues when trying to add data")
      }
    }
    //function to remove an entire deck
    const removedeck = async(uid, deck_name) => {
      try {
        //get user id
        const send_data = { 
          user_id:uid, 
          deck_name:deck_name, 
        }
        const response = await fetch(`${API_URL}/delete-deck`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(send_data)
        })
        const resdata = await response.json() //get response data
        if(!response.ok) {
            console.log("server issues when adding data", resdata)
            return 
        } else {
            return resdata
        }
      } catch {
        console.error("unknown issues when trying to add data")
      }
    }

    //destructure and rename data 
    const {data: rawcards, isSuccess, isError, isFetching} = useQuery({
        queryKey: ["cards"],
        queryFn: fetchRawcards,
        enabled: !!userlogin, //run if there is a userlogin
        staleTime: 1000*60*60*24, //time to keep query stale in ms
        cacheTime: 0, //time inactive queries stay 
    })

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user=>{
            setUserlogin(user);
        }); 
    },[])//register auth changes listener just once


    return (
        <UserContext.Provider value={{userlogin, rawcards,isFetching, cardsmap, addcard, removecard, removedeck,fetchRawcards}}>
            {children}
        </UserContext.Provider>
    )
}