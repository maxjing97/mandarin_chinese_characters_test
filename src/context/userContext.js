import { createContext, useContext, useEffect, useState } from "react";
import { auth  } from "./auth"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

//API  based on if the environment is dev or production
const API_URL = (process.env.NODE_ENV === 'development') ? "http://localhost:2008" : ""

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
export default function UserProvider ({children}) {
    const [userlogin, setUserlogin] = useState(null); //context variable to check if a user is logged in
    const queryClient = useQueryClient() //query client
    //async function to get data based on user id in userlogin (uid)
    const fetchRawcards = async() => {
        const send_data = {
            user_id:userlogin.uid
        }
        const response= await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(send_data)
        })
        //if not ok, return error 
        if(!response.ok) {
            console.log("error fetching card data")
            return
        } else {
            //otherwise, get the json data 
            const resdata = await response.json()
            return resdata
        }
    }

    //destructure and rename data 
    const {data: rawcards, isSuccess, isError} = useQuery({
        queryKey: ["cards_raw"],
        queryFn: fetchRawcards,
        enabled: !!userlogin, //run if there is a userlogin
        staleTime: 1000*60*60*24, //time to keep query stale in ms 
    })

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user=>{
            setUserlogin(user);
        });
    },[])//register auth changes listener just once


    return (
        <UserContext.Provider value={{userlogin, rawcards}}>
            {children}
        </UserContext.Provider>
    )
}