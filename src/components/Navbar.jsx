import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import logo from '../images/eb-logo.png'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {

    const {user, logout} = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("clicked");
        //axios.get('http://localhost:5500/auth/logout').then(resp => console.log(resp)).catch(err => console.log(err));
        axios.post('http://localhost:5500/auth/logout',{},{withCredentials: true}).then(resp => {
            console.log(resp);
            logout();
        }).catch(err => console.log(err));
        
    }

    return(<>
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <Link to="/profile"><img className="navbar-brand p-2" src={logo} style={{ width: '150px', height: '60px' }}/></Link>
        
        <button className="navbar-toggler" type="button" style={{
            marginRight: '5%'
        }} data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
                <Link className="nav-link text-light" to="/profile"><b>Profil</b></Link>
            </li>

            {user.resp.data.user.user_role == 1 ?
            <li className="nav-item dropdown bg-primary">
                <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <b>Kullanıcı İşlemleri</b>
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/user"><b>Kullanıcı Listele</b></Link>
                    <Link className="dropdown-item" to="/adduser"><b>Kullanıcı Ekle</b></Link>
                    <Link className="dropdown-item" to="/updateindividualinfo"><b>Bilgi Güncelleme</b></Link>
                    </div> 
                
            </li> 
            
            
            : <></> }

            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <b>Erzak İşlemleri</b>
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/listitems"><b>Erzak Listele</b></Link>
                    {user && user.resp.data.user.user_role == 1 ? 
                    <>
                        <Link className="dropdown-item" to="/additem"><b>Erzak Ekle</b></Link>
                        <Link className="dropdown-item" to="/dropitem"><b>Menü Hazırla</b></Link>
                        <Link className="dropdown-item" to="/sortitembydate"><b>Harcanan erzakları görüntüle</b></Link>
                    </>    
                        : ""
                    }   
                    </div>     
            </li>


            
            <li className="nav-item dropdown bg-primary">
                <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <b>Tarif İşlemleri</b>
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/sortdroppedmenuitems"><b>Sunulan menüleri görüntüle</b></Link>
                    <Link className={`dropdown-item`} to="/listrecipes"><b>Tarifleri Görüntüle</b></Link>

                    {user.resp.data.user.user_role == 1 ?
                    <><Link className={`dropdown-item`} to="/addrecipe"><b>Tarif Ekle</b></Link><Link className={`dropdown-item`} to="/dropitemsbyrecipe"><b>Tarife göre malzeme eksilt</b></Link></>
                    : <></> }        
                    </div> 
                
            </li> 
            
            
            
            {
                user.resp.data.user.is_super_admin === 1 ?             
            <li className="nav-item active">
                <Link to='/systemlogrequest' className="nav-link text-light"><b>Sistem Günlüğü Görüntüle</b></Link>
            </li> : ""
            }
            <li className="nav-item active">
                <Link onClick={() => handleLogout()} className="nav-link text-light"><b>Çıkış</b></Link>
            </li>
            </ul>
        </div>
        </nav>
    </>)
}

export default Navbar;