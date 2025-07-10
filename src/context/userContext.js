import { createContext, useContext, useEffect, useState } from "react";
import { auth  } from "./auth"
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
export default function UserProvider ({children}) {
    const [userlogin, setUserlogin] = useState(null); //context variable to check if a user is logged in

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user=>{
            setUserlogin(user);
        });

    },[])//register auth changes listener just once

    return (
        <UserContext.Provider value={{userlogin}}>
            {children}
        </UserContext.Provider>
    )
}