import React, {useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const UpdateIndividualInformation = () => {
    const { login, setCsrfToken, csrf, user, crerrorMessage, setcrErrorMessage, logout } = useAuth();

    const handleSubmit = async () => {
      await axios.put(`http://localhost:5500/users/${user.resp.data.user.id}`, {
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
            logout();
        }
    }).catch(err => console.log(err));
    }


    const [username, setUsername] = useState(user.resp.data.user.username);
    const [fullName, setFullName] = useState(user.resp.data.user.full_name);
    const [address, setAddress] = useState(user.resp.data.user.address);
    const [password, setPassword] = useState(user.resp.data.user.password);
    const [phone, setPhone] = useState(user.resp.data.user.phone);
    const [mail, setMail] = useState(user.resp.data.user.mail);
    const [userRole, setUserRole] = useState(user.resp.data.user.user_role);
    const [wrongCredMsg, setWrongCredMsg] = useState("");
    
    return(
    <>
    <div className="min-vh-100">
    <div className="row-fluid">
  
    <div className="row my-2 text-center">
      <h1 className="text-center">KULLANICI GÜNCELLE</h1>
    </div>
    
    <div className="p-12 col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 mx-5 my-5">
      <div className="jumbotron-fluid m-2 rounded bg-danger text-light p-2 text-center">
        <b>Bilgilerinizi güncellemeniz halinde değişikliklerin aktif hale gelmesi namına sisteme tekrar giriş yapmanız gerekmektedir.</b>
      </div>
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




        <button className="btn btn-lg btn-success" type="submit">GÜNCELLE</button>
      </form>
    </div>

    </div>
    </div>

    </>
    )
}

export default UpdateIndividualInformation;