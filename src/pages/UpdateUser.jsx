import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import image from '../images/belediye.jpg'
import { useNavigate } from "react-router-dom";
import {useLocation} from 'react-router-dom';



export const UpdateUser = () => {
  const location = useLocation();
  
  const navigate = useNavigate();



  useEffect(() => {
    if(typeof location.state == 'undefined' || location.state == null){
        navigate('/user');
      }
  }, []);
  const [username, setUsername] = useState(location.state ? location.state.username : "");
  const [fullName, setFullName] = useState(location.state ? location.state.full_name : "");
  const [address, setAddress] = useState(location.state ? location.state.address : "");
  const [password, setPassword] = useState(location.state ? location.state.password : "");
  const [phone, setPhone] = useState(location.state ? location.state.phone : "");
  const [mail, setMail] = useState(location.state ? location.state.mail : "");
  const [userRole, setUserRole] = useState(location.state ? location.state.user_role : -1);
  const [wrongCredMsg, setWrongCredMsg] = useState("");
  const { login, setCsrfToken, csrf, user, crerrorMessage, setcrErrorMessage } = useAuth();
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(username, fullName, address, password, phone, mail, userRole);
    if(userRole === -1){
        alert("Lütfen kullanıcı yetkisi seçiniz");
        return;
    }

    await axios.put(`http://localhost:5500/users/${location.state.id}`, {
        username: username,
        full_name: fullName,
        address: address,
        password: password,
        phone: phone,
        mail: mail,
        user_role: userRole,
        is_suspended: false
    }, {
        withCredentials: true,
        headers:{
          "Role": user.resp.data.user.user_role
      }
        
    }).then(resp => {
        //console.log(resp);
        if(resp.status === 200){
            navigate('/user');
        }
    }).catch(err => console.log(err));

    // Here you would usually send a request to your backend to authenticate the user
    // For the sake of this example, we're using a mock authentication

  };
  return (
    <div className="min-vh-100">
    <div className="row-fluid">
  
    <div className="row my-2 text-center">
      <h1 className="text-center">KULLANICI GÜNCELLE</h1>
    </div>
    
    <div className="p-12 col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 mx-5 my-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group my-3 ">
          <label htmlFor="username"><b>Kullanıcı Adı:</b></label>
          <input
            id="username"
            type="text"
            className="form-control shadow-lg border border-success rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={7}
            required
          />
        </div>

        <div className="form-group my-3 ">
          <label htmlFor="password"><b>Şifre:</b></label>
          <input
            id="password"
            type="password"
            className="form-control shadow-lg border border-success rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={7}
            maxLength={100}
            required
          />
        </div>


        <div className="form-group my-3 ">
          <label htmlFor="fullname"><b>İsim-Soyisim:</b></label>
          <input
            id="fullname"
            type="text"
            className="form-control shadow-lg border border-success rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            minLength={7}
            maxLength={1000}
            required
          />
        </div>


        <div className="form-group my-3 ">
          <label htmlFor="address"><b>Adres:</b></label>
          <textarea
            id="address"
            className="form-control shadow-lg border border-success rounded"
            value={address }
            maxLength={1000}
            onChange={(e) => setAddress(e.target.value)}
            
            required
          ></textarea>
        </div>

        <div className="form-group my-3 ">
          <label htmlFor="phone"><b>Telefon:</b></label>
          <input
            id="phone"
            type="text"
            className="form-control shadow-lg border border-success rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minLength={7}
            maxLength={20}
            required
          />
        </div>

        <div className="form-group my-3 ">
          <label htmlFor="mail"><b>E-Posta:</b></label>
          <input
            id="mail"
            type="email"
            className="form-control shadow-lg border border-success rounded"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="form-group my-3">
            <label htmlFor="userRole"><b>Kullanıcı Yetkisi:</b></label>
            <select id="userRole" className="form-select border border-success rounded"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
            >
                <option defaultValue={0}>Kullanıcı yetkisi seç</option>
                <option value={1}>Admin</option>
                <option value={2}>Kullanıcı</option>
            </select>
        </div>




        <button className="btn btn-lg btn-success" type="submit">GÜNCELLE</button>
      </form>
    </div>

    </div>
    </div>
  );
};