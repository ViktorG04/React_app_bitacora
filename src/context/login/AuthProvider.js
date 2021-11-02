import React, { useCallback } from 'react';
import AuthContext from "./AuthContext";
import { getLogin } from '../../config/axios';

export default function AuthProvider({ children }) {

    const handleLogin = useCallback(async (email, password) =>{
        console.log(email);
        let data = { email, password}
        var result = await getLogin(data);

        console.log(result);
       /* await getLogin('/api/login',
        {
            email, password
        }
        ).then((response) => {

            localStorage.setItem("isAuth", "true");
            localStorage.setItem("user", JSON.stringify({
            email,
            }));

            if (response.status === 200){
                localStorage.setItem("idRol", response.data.idRol);
                
            } else if (response.status === 400) {
                alert("Malooo");
            }
        })
            .catch((error) => {
            console.log(error);
        });*/
    }, []);

    
    return (
        <AuthContext.Provider value={{
            onLogin: handleLogin,
            isAuthenticated: localStorage.getItem("isAuth")?.length > 0,
            userRol: window.localStorage.getItem("idRol"),
        }}>
            {children}
        </AuthContext.Provider>
    );
}