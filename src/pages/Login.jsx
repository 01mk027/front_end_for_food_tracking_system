import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import image from '../images/belediye.jpg'
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, logout, setCsrfToken, csrf, user, crerrorMessage, setcrErrorMessage } = useAuth();
  const navigate = useNavigate();
  



useEffect(() => {
    if(user) navigate('/profile', {replace: true});
}, [user]);


  const handleLogin = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:5500/auth/login', {
        username: username,
        password: password,
    },{
      withCredentials: true
    }
  
  ).then(async (resp) => {
        console.log(resp);
        
        
        if(resp.data && resp.status == 200){
          login({resp});
        }
        else{
          await logout();
        }
        
        
    }).catch(async (err) => {
      
      console.log(err);
      if(err.code === "ERR_NETWORK"){
        setErrorMessage("Sunucuyla bağlantı kurulamadı.");
      }
      else if(err.response.data && err.response.status === 401)
      {
        setErrorMessage("Kullanıcı adı veya şifreniz yanlış.");
      }
      else{
        setErrorMessage("Kullanıcı kayıtlı değil veya teknik arıza sözkonusu. Lütfen sistem yöneticisine danışın!");
      }
      //await logout();
        /*
        if(err.response.data.statusCode == 401)
        {
          setWrongCredMsg("Kullanıcı adı veya şifre yanlış!");
          
        }
        */
    })

    // Here you would usually send a request to your backend to authenticate the user
    // For the sake of this example, we're using a mock authentication

  };
  return (
    <div className="row">
    {
      errorMessage && errorMessage.length > 0 ? <div className="alert alert-danger">
        {errorMessage}
      </div> : ""
    }
    <div className="row my-2 text-center">
      <h1 className="text-center">ERZAK TAKİP</h1>
    </div>

    <div className="colxl-6 col-lg-6 col-md-12 col-xs-12">
      <img className="img-fluid" src={image}/>
    </div>
    
    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 mx-3 my-5">
      <form onSubmit={handleLogin}>
        <div className="form-group my-3">
          <label htmlFor="username">Kullanıcı Adı:</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            maxLength={100}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <button type="submit" className="btn btn-lg btn-primary my-3">GİRİŞ YAP</button>
      </form>
    </div>

    </div>
  );
};