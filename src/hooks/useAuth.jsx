import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useLocalStorage({}, null);
  const [csrf, setCsrf] = useLocalStorage("", null);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage(false);
  //const [csrf, setCsrf] = useState("");
  const navigate = useNavigate();

  
  
  // call this function when you want to authenticate the user
  const login = async (data) => {
    //axios.defaults.withCredentials = true;
    setUser(data);
    setIsLoggedIn(true);
    navigate("/profile");
  };

  

  useEffect(() => {
    const timeoutId = setInterval(() => {
      // Your code to be executed after timeout
      axios.post('http://localhost:5500/auth/is-authenticated', {}, {
        withCredentials: true
      }).then(resp => {
        //setIsLoggedIn(true);
        //console.log(resp);
        
  
        
       if(resp.data !== true){
        setUser(null);
        logout();
       }
  
      }).catch((err) => {
        console.log(err);
        if(err.code === 'ERR_NETWORK' || err.response.status == 403) logout();
        console.log(err);
      });
    }, 3000); 
    return () => clearInterval(timeoutId);
  }, []);



  

  /*
  useEffect(() => {
    const timeout = setTimeout(() => {
      

    }, 5000);
    return () => {
        clearTimeout(timeout);
    }
});
*/
  
  /*
  useEffect(async () => {
    let id;
    const checkIfAuthed = setTimeout(() => {
      const api = axios.get('http://localhost:5500/auth/isauthed',{
        withCredentials: true
      }).then(resp => {
        console.log("yaşar");
        if(resp.status !== 200){
          logout();
        }
  
      }).catch(err => {
        logout();
      });

    }, 5000)
  })
*/
  const setCsrfToken = async (token) => {
    //console.log("in csrf token => ", token);
    setCsrf(token);
  }

  function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Example usage
  

  // call this function to sign out logged in user
  const logout = async () => {
    setIsLoggedIn(false);
    axios.create({
      transformRequest: (data, headers) => {
          // Remove all shared headers
          delete headers.common;
          delete headers.cookie;
          // or just the auth header
          delete headers.common.Authorization;
      }
  });
  //deleteCookie('connect.sid');
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      setCsrfToken,
      csrf,
      isLoggedIn
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};