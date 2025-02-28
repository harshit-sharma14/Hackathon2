import {React,useEffect,useState,createContext} from "react";
import axios from "axios";
export const UserContext = createContext();
export const UserContextProvider=({children})=>{
     //load the user when page refreshes
     const [user,setUser]=useState(null);
     const [ready,setReady]=useState(false);
   //load the user when page refreshes
   useEffect(() => {
     const storedUser = localStorage.getItem("user");
     if (storedUser) {
         try {
             setUser(JSON.parse(storedUser));
         } catch (e) {
             console.error("Error parsing stored user:", e);
         }
     }
     setReady(true);
 }, []);
 
 // Fetch user data from API only if localStorage doesn't have a valid user
 useEffect(() => {
     if (ready && !user) {  // Wait until localStorage check is done
         const token = localStorage.getItem("token");
         if (token) {
             axios.get('/getuser', {
                 headers: { Authorization: `Bearer ${token}` },
             })
             .then(({ data }) => {
                 setUser(data);
             })
             .catch(() => {
                 console.log("Failed to fetch user");
             });
         }
     }
 }, [ready]);
 useEffect(() => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}, [user]); // Runs only after localStorage is checked
 
 // Persist user to localStorage whenever it changes
 useEffect(() => {
     if (user) {
         localStorage.setItem("user", JSON.stringify(user));
     }
 }, [user]);
    return(
        <UserContext.Provider value={{user,setUser,ready,setReady}}>
            {children}
        </UserContext.Provider>
    )

}