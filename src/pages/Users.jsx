import { useEffect, useState } from "react";
import React from 'react';
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import moment from "moment";
import { UpdateUser } from "./UpdateUser";
import { useNavigate } from "react-router-dom";


const User = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([{}]);
    const { user, logout, csrf, setCsrfToken } = useAuth();
    const handleLogout = () => {
        //axios.get('http://localhost:5500/auth/logout').then(resp => console.log(resp)).catch(err => console.log(err));
        axios.post('http://localhost:5500/auth/logout').then(resp => {
            console.log(resp);
            logout();
        }).catch(err => console.log(err));
        
    }
    async function fetchUsers(){
        console.log("user");
        console.log(user);
        console.log("user");
        const axiosInstance = axios.create({
            withCredentials: true // Allow Axios to send cookies with requests
        });
        
        // Now you can use axiosInstance instead of axios for making requests
        axiosInstance.get('http://localhost:5500/users', {
            headers:{
                "Role": user.resp.data.user.user_role
            }
        })
            .then(response => {
            // Handle successful response
            setUsers(response.data)
            console.log(response.data);
            })
            .catch(error => {
            // Handle error
            console.error('Error:', error);
            });
    }

    useEffect(() => {
        fetchUsers();
        // Create an instance of Axios with default configuration

    }, [user]);


    const handleSuspend = async (e, id) => {
        e.preventDefault();
        
          await axios.delete(`http://localhost:5500/users/suspend/${id}`, {
            withCredentials: true,
            headers:{
                "Role": user.resp.data.user.user_role
            }
        }).then(resp => {
            console.log(resp);
            fetchUsers();
        })
        .catch(err => console.log(err));
    }

    const handleUnsuspend = async (e, id) => {
        e.preventDefault();


        await axios.put(`http://localhost:5500/users/unsuspend/${id}`, {}, {withCredentials: true,
        headers:{
            "Role": user.resp.data.user.user_role
        }
    }).then(resp => {
            console.log(user);
            console.log(resp);
            
            fetchUsers();
        }).catch(err => console.log(err));
    }


    //console.log(users);

    const print = () => {
        console.log(users);
    };

    return (
        <div className="min-vh-100">
<div className="container">
<div className="row-fluid">
        <h1 className="text-center text-danger">KULLANICI LİSTESİ</h1>
    </div>
<div className="table-responsive-sm overflow-auto">    
<table className="table p-3">
        <thead>
            <tr>
            <th scope="col">İsim - Soyisim</th>
            <th scope="col">Kullanıcı Adı</th>
            <th scope="col">Mail Adresi</th>
            <th scope="col">Katılma Tarihi</th>
            <th scope="col">Güncellenme tarihi</th>
            <th scope="col">Unvan</th>
            <th scope="col">Askıya Al</th>
            <th scope="col">Bilgi Güncelle</th>
            </tr>
        </thead>
        <tbody>
        {
            users.filter((u) => {return u.id != user.resp.data.user.id; }).map(function(m, key){
                return (
                    <tr key={Math.floor(Math.random() * 100000000)}>
                        <td>{m.full_name}</td>
                        <td>{m.username}</td>
                        <td>{m.mail}</td>
                        <td>{m.created_at}</td>
                        <td>{m.updated_at}</td>
                        <td>{m.user_role == 1  ? "Admin" : "Kullanıcı"}</td>
                        <td>{m.is_suspended == 0 ? <button className="btn btn-sm btn-danger" onClick={(e) => handleSuspend(e, m.id)}>ASKIYA AL</button> : 
                                                   <button className="btn btn-sm btn-success" onClick={(e) => handleUnsuspend(e, m.id)}>ASKIDAN ÇEK</button> 
                        }</td>
                        <td><button className="btn btn-sm btn-primary"
                            onClick={() => { navigate('/updateuser', {state:m}) }}
                        >
                            Güncelle
                        </button></td>
                    </tr>
                )
            })
        }
        </tbody>
        </table>
        </div>
        </div>
        </div>
    )
}

export default User;