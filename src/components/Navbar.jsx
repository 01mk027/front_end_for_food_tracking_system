import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import logo from '../images/eb-logo.png'


const Navbar = () => {

    const {user, logout} = useAuth();
    const [isHovered, setIsHovered] = useState(false);
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
                <Link className="nav-link font-weight-bold" to="/profile">Profil</Link>
            </li>

            {user.resp.data.user.user_role == 1 ?
            <li className="nav-item dropdown bg-primary">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Kullanıcı İşlemleri
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/user">Kullanıcı Listele</Link>
                    <Link className="dropdown-item" to="/adduser">Kullanıcı Ekle</Link>
                    </div> 
                
            </li> 
            
            
            : <></> }

            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Erzak İşlemleri
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/listitems">Erzak Listele</Link>
                    {user && user.resp.data.user.user_role == 1 ? 
                    <>
                        <Link className="dropdown-item" to="/additem">Erzak Ekle</Link>
                        <Link className="dropdown-item" to="/dropitem">Menü Hazırla</Link>
                        <Link className="dropdown-item" to="/sortitembydate">Harcanan erzakları görüntüle</Link>
                    </>    
                        : ""
                    }   
                    </div>     
            </li>


            
            <li className="nav-item dropdown bg-primary">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Tarif İşlemleri
                </a>
                
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className={`dropdown-item`} to="/sortdroppedmenuitems">Sunulan menüleri görüntüle</Link>
                    <Link className={`dropdown-item`} to="/listrecipes">Tarifleri Görüntüle</Link>

                    {user.resp.data.user.user_role == 1 ?
                    <><Link className={`dropdown-item`} to="/addrecipe">Tarif Ekle</Link><Link className={`dropdown-item`} to="/dropitemsbyrecipe">Tarife göre malzeme eksilt</Link></>
                    : <></> }        
                    </div> 
                
            </li> 
            
            
            
            {
                user.resp.data.user.is_super_admin === 1 ?             
            <li className="nav-item active">
                <Link to='/systemlogrequest' className="nav-link">Sistem Günlüğü Görüntüle</Link>
            </li> : ""
            }
            <li className="nav-item active">
                <Link onClick={() => handleLogout()} className="nav-link">Çıkış</Link>
            </li>
            </ul>
        </div>
        </nav>
    </>)
}

export default Navbar;