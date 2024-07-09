import React from 'react';
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ListFoodItems = () => {
    const [items, setItems] = useState([{}]);
    const [isConfirmWindowShown, setIsConfirmWindowShown] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    
    async function fetchItems(){
        
        console.log(user);
        const axiosInstance = axios.create({
            withCredentials: true, // Allow Axios to send cookies with requests
            headers:{
                "Role": user.resp.data.user.user_role
            }
        });
        
        // Now you can use axiosInstance instead of axios for making requests
        axiosInstance.get('http://localhost:5500/depo')
            .then(response => {
            // Handle successful response
            setItems(response.data)
            console.log(response.data);
            })
            .catch(error => {
            // Handle error
            console.error('Error:', error);
            });
    }

    useEffect(() => {
        fetchItems();
        // Create an instance of Axios with default configuration

    }, []);
    /*
    async function fetchItems(){
        axios.get('http://localhost:5500/depo', {
            withCredentials: true
        }).then(resp => {
            if(resp.status == 200){
                console.log(resp.data);
                setItems(resp.data);
            }
        }).catch(err => console.log(err));
    }    

    useEffect(() => {
        fetchItems();
    }, [])
*/
    

    const handleDelete = async (e, id) => {
        e.preventDefault();
        setIsConfirmWindowShown(!isConfirmWindowShown);
        console.log(isConfirmWindowShown);
        let text = "Ürünü silmek istediğinizden emin misiniz?";
        window.confirm(text);
        if(window.confirm(text) == true)
        {
            console.log("handleDelete", e.target.id);
            await axios.delete(`http://localhost:5500/depo/${e.target.id}`, {
                withCredentials: true,
                headers:{
                    "Role": user.resp.data.user.user_role
                }
            }).then(res => {
                console.log(res);
                if(res.status === 200){
                    fetchItems();
                }
            }).catch(err => console.log(err));
        }
        

    }
    return (
    <div className='min-vh-100'>
            <div className="container">

<div className="row text-center">
    <h1 className="text-danger my-4"><u>MALZEME LİSTESİ</u></h1>
</div>
{
    items && items.length > 0 ? 
    <div className='table-responsive-sm overflow-auto'>
            <table className="table">
            <thead>
                <tr>
                <th scope="col">Ürün Adı</th>
                <th scope="col">Miktar</th>
                <th scope="col">Birim</th>
                <th scope="col">Eklenme Tarihi</th>
                <th scope="col">Güncellenme tarihi</th>
                <th scope="col">Ekleyen Kullanıcı</th>
                {user && user.resp.data.user.user_role == 1 ?
                <>
                <th scope="col">Ürün Bilgisi Düzelt</th>
                <th scope="col">Ürün Kaldır</th>
                </> : ""}
                </tr>
            </thead>
            <tbody>
            {
                items.map((i, key) => {
                    return(
                        <tr key={Math.floor(Math.random() * 10000000000)}>
                            <td>{i.item_name}</td>
                            <td>{i.unit}</td>
                            <td>{i.quantity}</td>
                            <td>{i.created_at}</td>
                            <td>{i.updated_at}</td>
                            <td>{i.user && i.user.username}</td>
                            {user && user.resp.data.user.user_role == 1 ? 
                            <>
                            <td><button className="btn btn-sm btn-success" onClick={() => navigate('/edititem', {state: i})}>ÜRÜN BİLGİSİ DÜZELT</button></td>
                            <td><button className="btn btn-sm btn-danger" id={i.id} onClick={(e) => handleDelete(e)}>ÜRÜN SİL</button></td>
                            </> : ""}
                        </tr>
                    )
                })
            }
            </tbody>
            </table>    
    </div> : <h1 className="text-danger">Ürün Bulunamadı. {user && user.resp.data.user_role == 1 ? <>Lütfen <Link to="/additem"> ürün girişi</Link> yapınız.</> : ""}</h1>
}


            </div>
    </div>)
};

export default ListFoodItems;