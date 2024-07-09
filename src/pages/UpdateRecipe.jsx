import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const UpdateRecipe = () => {
    const { user } = useAuth();
    const location = useLocation();
  
    const navigate = useNavigate();

    const [recipeId, setRecipeId] = useState(location.state ? location.state.id : -1);
    const [cookName, setCookName] = useState(location.state ? location.state.cook_name : "");
    const [description, setDescription] = useState(location.state ? location.state.description : "");
    const [formattedSelectedItems, setFormattedSelectedItems] = useState(location.state ? location.state.items : []);
    //const [items, setItems] = useState(new Set(formattedSelectedItems));
    const [savedFoodItems, setSavedFoodItems] = useState([]);
    const [inputValArray, setInputValArray] = useState([]);

    
    //const [formattedSelectedItems, setFormattedSelectedItems] = useState([]);

    
    const assignUnit = (unit) => {
        if(unit === 'kg')
        {
            return 'gram';
        }
        else if(unit === 'lt'){
            return 'ml';
        }
        else{
            return 'tane';
        }
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        //{cook_name: cookName, items: customItemArray, description: description}
        //alert(recipeId);
        await axios.put(`http://localhost:5500/recipe/${recipeId}`, 
            {cook_name: cookName, items: formattedSelectedItems, description: description},
            {withCredentials: true, headers: {
                "Role": user.resp.data.user.user_role
            }}
        ).then(resp => {
            if(resp.status === 200){
                navigate('/listrecipes', { replace: true })
            }
        }).catch(err => console.log(err));
    }

    const handleSelect = async (event) => {
        const axiosInstance = axios.create({
            withCredentials: true, // Allow Axios to send cookies with requests
            headers: {
                "Role": user.resp.data.user.user_role
            }
        });

        // Now you can use axiosInstance instead of axios for making requests
        axiosInstance.get(`http://localhost:5500/depo/${event.target.value}`)
            .then(response => {
                console.log(response.data);
                
                    for(let i=0; i<formattedSelectedItems.length; i++){
                        if(response.data.item_name === formattedSelectedItems[i].item_name){
                            return;
                        }
                    }
                    setFormattedSelectedItems([...formattedSelectedItems, {
                        item_id: response.data.id,
                        item_name: response.data.item_name,
                        quantityPerPortion: '',
                        unitPerPortion: assignUnit(response.data.quantity)
                    }]);
                
                /*

{
    "id": 1,
    "item_name": "Domates",
    "unit": 10000,
    "quantity": "kg",
    "created_at": "2024-06-20 22:57:35",
    "updated_at": null,
    "is_consumed": 0
}





                item_id:2
                item_name: "Yumurta",
                quantityPerPortion: "2"
                unitPerPortion: "tane"


                */
                //console.log("event.target.value", event.target.value);
                /*
                setSelectedItemName(
                    new Set([...selectedItemName, {item_id: response.data.item_id, item_name: response.data.item_name, quantity: response.data.quantity, unit: response.data.unit}])
                )
                */
                //console.log(response.data.item_name);

                //setSelectedItemName([...selectedItemName, response.data]);

                //const updatedSet = new Set([...selectedItems, JSON.stringify(response.data)]);
                // Update state with the new set
                //setSelectedItems(updatedSet); 
                


                /* KAYBOLMA
                if(selectedItemName.size >= 1){
                    console.log("işte tam da burada setSelectedItemName operasyonu");                
                    //setSelectedItemName(new Set(formattedSelectedItemName));
                }
                else{
                    
                }
                */
            })
            .catch(error => {
                // Handle error
                console.error(error);
            });

    

    }

    const dropItem = (id) => {
        setFormattedSelectedItems(items => items.filter(item => item.item_id !== id));
        //setItems(new Set(formattedSelectedItems));
        //alert(id);
        console.log("formattedSelectedItems: \n", formattedSelectedItems);
        //console.log("items: \n", items);
    }




    async function fetchItems(){
        
        
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
            setSavedFoodItems(response.data)
            //console.log(response.data);
            })
            .catch(error => {
            // Handle error
            console.error('Error:', error);
            });
    }



  
    useEffect(() => {
      if(typeof location.state == 'undefined' || location.state == null){
          navigate('/listrecipes');
        }

        console.log(location.state);
    }, []);


    useEffect(() => {
        fetchItems();
    }, []);


    useEffect(() => {
        const item_frame = document.querySelector('#item_frame');
        const inputArr = item_frame.querySelectorAll('input');
        let arr = new Array();
        inputArr.forEach(item => arr.push(item.value));
        setInputValArray(arr);
    }, [formattedSelectedItems]);

    

    return(
        <>
            <div className="container-fluid min-vh-100">
                <div className="row my-2 text-center">
                    <h1 className="text-center text-danger">TARİF GÜNCELLE</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='text-center'>
                    <div className="form-group my-3 ">
                        <label htmlFor="username"><b>Yemek İsmi:</b></label>
                        <input
                            id="cookName"
                            type="text"
                            className="form-control shadow-lg border border-success rounded"
                            value={cookName}
                            onChange={(e) => setCookName(e.target.value)}
                            minLength={3}
                            maxLength={250}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <select onChange={handleSelect} className='form-select form-select-md border border-danger'>
                            <option>Yemekte kullanacağınız malzemeleri alttaki açılır menüden seçiniz</option>
                        {savedFoodItems && savedFoodItems.map((item) => {
                            return (
                                <option key={Math.floor(Math.random() * 10000000000)} value={item.id}>{item.item_name}</option>
                            )
                        })}
                        </select>
                    </div>
                    
                    <div id="item_frame">
                    {formattedSelectedItems && formattedSelectedItems.map((item, key) => 
                        <div className="jumbotron-fluid bg-warning my-2 rounded p-2">
                            <div style={{ marginLeft: '90%' }}>
                                                        <button type="button" onClick={() => { dropItem(item.item_id) }} className="btn btn-close" >X</button>
                            </div>
                            {item.item_name} Geçerli birim: ({item.unitPerPortion})
                            <input
                                    type="number"
                                    className="form-control shadow-lg border border-success rounded"
                                    value={item.quantityPerPortion}
                                    id={item.item_name}
                                    min={1}
                                    max={1000000000000}
                                    
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setInputValArray((prev) => {
                                            const newArray = [...prev];
                                            newArray[key] = newValue;
                                            return newArray;
                                        });
                                        setFormattedSelectedItems((prevItems) => {
                                            const newItems = [...prevItems];
                                            newItems[key].quantityPerPortion = newValue;
                                            return newItems;
                                        });
                                    }}
                                    required
                                />
                        </div>
                    )}
                    </div>


                    {
                        formattedSelectedItems && formattedSelectedItems.length >= 1 ? 
                        <div className="form-group">
                                <label htmlFor="description"><b>Tarif açıklaması:</b></label>
                                <textarea class="form-control border border-warning" 
                                value={description}
                                id="description" 
                                rows="5" 
                                placeholder='Tarif açıklaması giriniz' onChange={(e) => setDescription(e.target.value)} 
                                maxLength={1000}
                                required></textarea>
                        </div> 
                        : ""
                    }
                    <input type='submit' className='btn btn-lg btn-success my-2' value='GÜNCELLE'/>
                    </div>
                </form>


            </div>
        </>
    )

};

export default UpdateRecipe;