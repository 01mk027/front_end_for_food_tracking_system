import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';


const AddRecipe = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState();
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [formattedSelectedItems, setFormattedSelectedItems] = useState([]);
    const [inputValArray, setInputValArray] = useState([]);
    const [cookName, setCookName] = useState('');
    const [description, setDescription] = useState('');


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

    const dropItem = (id) => {
        setFormattedSelectedItems(items => items.filter(item => item.id !== id));
        if (formattedSelectedItems.length <= 0) {
            setSelectedItems(new Set());
            setFormattedSelectedItems(new Array());
        }
        else{
            let formattedSet = [...selectedItems].filter((item) => {
                if (item.id != id) {
                    if (typeof item === 'string') return JSON.parse(item);
                    else if (typeof item === 'object') return item;
                }

                //return item.id != id;
                //JSON.stringify(Array.from(s.values())
            });
            let newArr = new Array();
            formattedSet.forEach((item) => item && newArr.push(item));
            //itemi bul, çek ve splice et
            let itm = newArr.find(item => JSON.parse(item).id === id);
            let indexOfDiscardedItem = newArr.indexOf(itm);
            if (indexOfDiscardedItem > -1) {
                newArr.splice(indexOfDiscardedItem, 1);
            }


            //console.log(JSON.parse(newArr));
            setSelectedItems(new Set(newArr));
        }
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
                //console.log("event.target.value", event.target.value);
                /*
                setSelectedItemName(
                    new Set([...selectedItemName, {item_id: response.data.item_id, item_name: response.data.item_name, quantity: response.data.quantity, unit: response.data.unit}])
                )
                */
                //console.log(response.data.item_name);

                //setSelectedItemName([...selectedItemName, response.data]);

                const updatedSet = new Set([...selectedItems, JSON.stringify(response.data)]);
                // Update state with the new set
                setSelectedItems(updatedSet); 
                


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        let customItemArray = new Array();
        for(let i=0; i<formattedSelectedItems.length; i++)
        {
            //console.log(document.getElementById(formattedSelectedItems[i].item_name).value);
            //console.log(inputValArray[i]," >>> ", formattedSelectedItems[i]);
            customItemArray.push({
                item_id: formattedSelectedItems[i].id,
                item_name: formattedSelectedItems[i].item_name,
                quantityPerPortion: document.getElementById(formattedSelectedItems[i].item_name).value,
                unitPerPortion: assignUnit(formattedSelectedItems[i].quantity)
            });
        }
        let wholeObject = {
            cook_name: cookName,
            items: customItemArray,
            description: description
        };

        const axiosInstance = axios.create({
            withCredentials: true, // Allow Axios to send cookies with requests
            headers: {
                "Role": user.resp.data.user.user_role
            }
        });

        await axios.post('http://localhost:5500/recipe/addrecipe', {cook_name: cookName, items: customItemArray, description: description}, {withCredentials: true, headers:{
            "Role": user.resp.data.user.user_role
        }}).then(resp => {
            if(resp.status === 200){
                navigate('/listrecipes', { replace: true });
            }
        }).catch(err => console.log(err));
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

    useEffect(() => {
        const formattedSet = [...selectedItems].map((item) => {
            if (typeof item === 'string') return JSON.parse(item);
            else if (typeof item === 'object') return item;

            //JSON.stringify(Array.from(s.values())
        });
        setFormattedSelectedItems(formattedSet);
        
        /*
        let newArr = new Array();
        formattedSet.forEach(item => newArr.push(item));
        setFormattedSelectedItems(newArr);
        console.log(formattedSelectedItems);
        */
    }, [selectedItems])



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
            { items && items.length === 0 ? 
            <div className="jumbotron-fluid bg-danger my-2 p-3 rounded">
                Ürün bulunamadı, depoda olmayan ürünlerden tarif yapılması gerçekle bağdaşmamaktadır. Ürün eklemek için <Link to='/additem'>tıklayınız</Link>.
            </div> : 
            <div className='p-12 col-xl-9 col-lg-9 col-md-7 col-sm-6 col-xs-6 mx-5 my-5 text-center'>
                <h3 className='text-danger'>TARİF EKLE</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group my-3 ">
                        <label htmlFor='cook_name'><b>Yemeğin ismi:</b></label>
                        <input type='text' className='form-control shadow-lg border border-success rounded' name='cook_name'
                         value={cookName}
                         onChange={(e) => setCookName(e.target.value)}  
                         maxLength={150}
                         required 
                        />
                    </div>

                    <div className="form-group">
                        <select onChange={handleSelect} className='form-select form-select-md border border-danger'>
                            <option>Yemekte kullanacağınız malzemeleri alttaki açılır menüden seçiniz</option>
                        {items && items.map((item) => {
                            return (
                                <option key={Math.floor(Math.random() * 10000000000)} value={item.id}>{item.item_name}</option>
                            )
                        })}
                        </select>
                    </div>

                    <div id="item_frame">    
                    {
                        formattedSelectedItems && formattedSelectedItems.map((value, key) => {
                            return(
                                <div className='jumbotron-fluid bg-warning text-center my-3 rounded p-3' key={key}>
                                    <div style={{ marginLeft: '90%' }}>
                                                        <button type="button" onClick={() => { dropItem(value.id) }} className="btn btn-close" >X</button>
                                                    </div>
                                    Seçilen malzeme: <b>{value.item_name}</b><br/>
                                    Bulunan Miktar: {value.unit} {value.quantity}<br/>
                                    Lütfen seçilen malzemeden bir porsiyonda (1 kişilik yemekte) ne kadar kullanacağınızı girin:<br/>
                                    Lütfen {assignUnit(value.quantity)} olarak giriniz. Girilebilecek maksimum değer 2000 birim olarak tayin edilmiştir.
                                    <input className='form-control' type='number' 
                                                    id={value.item_name}
                                                    onChange={(e) =>
                                                        setInputValArray((prev) => {
                                                            prev[key] = e.target.value;
                                                            return [...prev];
                                                        })}
                                                        min={1}
                                                        max={200000}
                                    required        
                                    /> 
                                </div>
                            )
                        })
                    }
                    </div>
                    {
                        formattedSelectedItems && formattedSelectedItems.length >= 1 ? 
                        <div className="form-group">
                                <label htmlFor="description"><b>Tarif açıklaması:</b></label>
                                <textarea class="form-control border border-warning" id="description" rows="5" placeholder='Tarif açıklaması giriniz' onChange={(e) => setDescription(e.target.value)} maxLength={1000} required></textarea>
                        </div> 
                        : ""
                    }

                    {formattedSelectedItems && formattedSelectedItems.length > 0 ? 
                    <input type='submit' className='btn btn-lg btn-success' value='EKLE'/>
                    : ""}
                    
                </form>
            </div>
            }
        </div>
        </>
    )
}

export default AddRecipe;