import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import image from '../images/belediye.jpg'
import { useNavigate } from "react-router-dom";



export const AddUser = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [userRole, setUserRole] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, setCsrfToken, csrf, user, crerrorMessage, setcrErrorMessage } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(username, fullName, address, password, phone, mail, userRole);
    if(userRole === -1){
        alert("Lütfen kullanıcı yetkisi seçiniz");
        return;
    }

    await axios.post('http://localhost:5500/users/adduser', {
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
    }).catch(err => {
      console.log(err);
      if(err.response && err.response.status === 500 && err.response.data.class && err.response.data.class == 14){
        setErrorMessage("Kullanıcı adı, email ve telefon, diğer kullanıcılarınki ile aynı olmamalıdır.");
        window.scrollTo(0, 0);
      }
    });


  };



  return (
    <div className="min-vh-100">
    <div className="row-fluid">
    {errorMessage ? <div className="alert alert-danger">
      {errorMessage}
    </div> : ""}
    <div className="row my-2 text-center">
      <h1 className="text-center">KULLANICI EKLE</h1>
    </div>
    
    <div className="p-12 col-xl-10 col-lg-10 col-md-10 col-sm-6 col-xs-4 mx-5 my-5 float-center">
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
            maxLength={20}
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
            maxLength={200}
            required
          />
        </div>


        <div className="form-group my-3 ">
          <label htmlFor="address"><b>Adres:</b></label>
          <textarea
            id="address"
            className="form-control shadow-lg border border-success rounded"
            value={address }
            onChange={(e) => setAddress(e.target.value)}
            maxLength={1000}
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
            maxLength={50}
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




        <button className="btn btn-lg btn-success" type="submit">EKLE</button>
      </form>
    </div>

    </div>
    </div>
  );
};