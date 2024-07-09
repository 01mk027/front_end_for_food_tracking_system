import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';


const EditFoodItem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);
    /*
item_name
quantity
unit

    */ 
    const [itemName, setItemName] = useState(location.state ? location.state.item_name : "");
    const [quantity, setQuantity] = useState(location.state ? location.state.quantity : "");
    const [unit, setUnit] = useState(location.state ? location.state.unit : "");


    useEffect(() => {
        if(typeof location.state == 'undefined' || location.state == null){
            navigate('/listitems');
          }
      }, []);


    const handleUpdateItem = async (e) => {
        e.preventDefault();
        
        await axios.put(`http://localhost:5500/depo/correct/${location.state.id}`, {
            "item_name": itemName,
            "quantity": quantity,
            "unit": unit
        }, {
            withCredentials: true,
            headers:{
              "Role": user.resp.data.user.user_role
          }
        }).then(resp => {
            console.log(resp);
            if(resp.status === 200){
                navigate('/listitems', {replace: true});
            }
        }).catch(err => {
            console.log(err);
        })
        
    }


    return(
      <div className='min-vh-100'>
        <div className="row">
  
        <div className="row my-2 text-center">
          <h1 className="text-center">MALZEME GÜNCELLE</h1>
        </div>
        
        <div className="p-12 col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 mx-5 my-5">
          <form onSubmit={handleUpdateItem}>
            <div className="form-group my-3 ">
              <label htmlFor="itemName"><b>Malzeme ismi:</b></label>
              <input
                id="itemName"
                type="text"
                className="form-control shadow-lg border border-success rounded"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                maxLength={200}
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
                onChange={(e) => setUnit(e.target.value)}
                max={10000000}
                maxLength={15}
                required
              />
            </div>
    
    
            <div className="form-group my-3 ">
            <label htmlFor="quantity"><b>Ürün Birimi:</b></label>
            <select id="quantity" className="form-select border border-success rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            >
                
                <option value={'kg'}>kg</option>
                <option value={'lt'}>lt</option>
                <option value={'tane'}>tane</option>
            </select>
            </div>
    
    
    
    
            <button className="btn btn-lg btn-success" type="submit">GÜNCELLE</button>
          </form>
        </div>
    
        </div>
        </div>
    )
}

export default EditFoodItem;