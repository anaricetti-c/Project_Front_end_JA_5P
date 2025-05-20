import { useState, createContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export const UserContext = createContext();
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [firstAccess, setFirstAccess] = useState(false);

    
    useEffect(() => {
        const token = sessionStorage.getItem('@ACCESS_TOKEN');
        if (token) {
          try {
            const decodedUser = jwtDecode(token);
            setCurrentUser(decodedUser);
        
          } catch (error) {
            console.error("Erro ao decodificar o token: ", error);
            userLogout();
          }
        }
    }, []); 

    function Login(token) {
        sessionStorage.setItem('@ACCESS_TOKEN', token);
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser);
    }

    function userLogout() {
        sessionStorage.removeItem('@ACCESS_TOKEN');
        setCurrentUser(null);
    }
   
    return (
        <UserContext.Provider
            value={{
                currentUser,
                firstAccess,
                Login,
                userLogout,
                setFirstAccess
            }}
        >
            {children}
        </UserContext.Provider>
    )
}