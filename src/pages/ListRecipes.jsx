import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ListRecipes = () => {

    const {user} = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [isConfirmWindowShown, setIsConfirmWindowShown] = useState(false);
    const navigate = useNavigate();


    const fetchRecipes = async () => {
        const axiosInstance = axios.create({
            withCredentials: true, // Allow Axios to send cookies with requests
            headers: {
                "Role": user.resp.data.user.user_role
            }
        });

        await axios.get('http://localhost:5500/recipe/fetchrecipes', {withCredentials: true, headers: {
            "Role": user.resp.data.user.user_role
        }}).then(resp => {
            if(resp.status === 200){
                console.log(resp.data);
                setRecipes(resp.data);
            }
        }).catch(err => console.log(err));
 
    }

    useEffect(() => {
        fetchRecipes();
   }, []);


   async function handleDelete(e)  {
    e.preventDefault();
    setIsConfirmWindowShown(!isConfirmWindowShown);
    console.log(isConfirmWindowShown);
    let text = "Ürünü silmek istediğinizden emin misiniz?";
    window.confirm(text);
    if(window.confirm(text) == true)
    {    
        await axios.delete(`http://localhost:5500/recipe/${e.target.id}`, {
            withCredentials: true,
            headers:{
                "Role": user.resp.data.user.user_role
            }
        }).then(res => {
            console.log("response for deleting recipe");
            console.log(res);
            if(res.status === 200){
                fetchRecipes();
            }
        }).catch(err => console.log(err));
    }
    

}

    return(
        <>
            <div className="container-fluid min-vh-100">
                {recipes.length > 0 ?  recipes.map((value) => {
                    return(
                        <div className="jumbotron-fluid my-4 rounded bg-warning">
                            <div className="row p-2">
                                <div className="col-4">
                                    <h6>Yemek İsmi:</h6>
                                    <p>{value.cook_name}</p>
                                </div>

                                <div className="col-4">
                                    <h6>Kullanılan malzemeler (Kişi başı):</h6>
                                    <ul>
                                        {value.items && value.items.map(item => {
                                            return(
                                                <li key={Math.floor(Math.random() * 1000000000)}>{item.item_name} {item.quantityPerPortion} {item.unitPerPortion}</li>
                                            )
                                        })}
                                    </ul>
                                </div>

 
                                    <div className="col-4">
                                    { user.resp.data.user.user_role == 1 ?<>
                                    <button className='btn btn-block btn-success col-12 my-2' onClick={() => { navigate('/updaterecipe', {state:value}) }}>GÜNCELLE</button>
                                    <button className="btn btn-block btn-danger col-12 my-2" id={value.id} onClick={(e) => handleDelete(e)}>SİL</button>     
                                    </>
                                    :
                                    <>    
                                    <h6>Açıklama:</h6>
                                    {value.description}
                                    </>
                                    }    
                                    </div>

                                     
                                
                            </div>
                        </div>
                    )
                }) : 
                <div className='jumbotron-fluid bg-warning border border-info rounded my-3'>
                    Hiç tarif bulunamadı. Tarif eklemek için <Link to='/addrecipe'>buraya tıklayın.</Link>
                </div>
                }
            </div>
        </>
    )
};

export default ListRecipes;