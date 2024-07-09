import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AddFoodItem = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [itemName, setItemName] = useState("");
    const [unit, setUnit] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    

    /*
    async function fetchItems()
    {
        await axios.post('http://localhost:5500/depo/additem', {
        "item_name": "ss",
        "unit": 35,
        "quantity": "kg",
        "is_consumed": false
    }, {
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
            'role':1
        }
    }).then(resp => console.log(resp)).catch(err => console.log(err));
}
*/
    const handleAddItem = async (e) => {
        e.preventDefault();
        
        
        if(quantity == ''){
          alert("Lütfen bir birim seçiniz");
          return;
        }
        //console.log(itemName, unit, quantity);
        await axios.post('http://localhost:5500/depo/additem', {
            "item_name": itemName,
            "unit": unit,
            "quantity": quantity
        }, {
            withCredentials: true,
            headers:{
              "Role": user.resp.data.user.user_role
          }            
        }).then(resp => {
            console.log(resp);
            if(resp.status === 200){
                navigate('/listitems', { replace: true });
            }
        }).catch(err => {
          console.log(err);
          if(err.response && err.response.status === 500 && err.response.data.class && err.response.data.class == 14){
            setErrorMessage(`${itemName} zaten mevcut!`);
            window.scrollTo(0, 0);
          }
        });
        
    }

    return (
      <div className="min-vh-100">
        


        <div className="row-fluid">
        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ""}
        
        <div className="row my-2 text-center">
          <h1 className="text-center">MALZEME EKLE</h1>
        </div>
        
        <div className="p-12 col-xl-9 col-lg-9 col-md-7 col-sm-6 col-xs-6 mx-5 my-5">
          <form onSubmit={handleAddItem}>
            <div className="form-group my-3 ">
              <label htmlFor="itemName"><b>Malzeme ismi:</b></label>
              <input
                id="itemName"
                type="text"
                className="form-control shadow-lg border border-success rounded"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                maxLength={250}
                required
              />
            </div>
    
            <div className="form-group my-3 ">
              <label htmlFor="unit"><b>Miktar:</b></label>
              <input
                id="unit"
                type="number"
                className="form-control shadow-lg border border-success rounded"
                value={unit}
                min={1}
                max={100000000000000000000}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>
    
    
            <div className="form-group my-3 ">
            <label htmlFor="quantity"><b>Ürün Birimi:</b></label>
            <select id="quantity" className="form-select border border-success rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            >
                <option defaultValue={'N/A'}>Lütfen birim seçiniz</option>
                <option value={'kg'}>kg</option>
                <option value={'lt'}>lt</option>
                <option value={'tane'}>tane</option>
            </select>
            </div>
    
    
    
    
            <button className="btn btn-lg btn-success" type="submit">EKLE</button>
          </form>
        </div>
    
        </div>
        </div>
    )
}

export default AddFoodItem;