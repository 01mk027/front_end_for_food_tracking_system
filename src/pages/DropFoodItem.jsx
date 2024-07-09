import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import memoize from "fast-memoize";
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';



const DropFoodItem = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([{}]);
    const [selectedItemName, setSelectedItemName] = useState(new Set());
    const [cpSelectedItemName, setCpSelectedItemName] = useState([]);
    const [formattedSelectedItemName, setFormattedSelectedItemName] = useState([]);
    const [numberOfForms, setNumberOfForms] = useState(0);
    const [inputValArray, setInputValArray] = useState(Array(formattedSelectedItemName.length).fill(""));
    const [updatedItems, setUpdatedItems] = useState([]);

    const [numberOfUpdatedItems, setNumberOfUpdatedItems] = useState(0);
    const [amountOfMultiplication, setAmountOfMultiplication] = useState(0);
    const [unit, setUnit] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [blacklistedItems, setBlacklistedItems] = useState([]);


    useEffect(() => {
        setBlacklistedItems([]);
    }, [amountOfMultiplication])


    const updateAllItems = (e) => {
        let isConsumable = true;
        let preventArr = [];
        e.preventDefault();
        const formattedSet = [...selectedItemName].map((item) => {
                if (typeof item === 'string') return JSON.parse(item);
                else if (typeof item === 'object') return item;

                //JSON.stringify(Array.from(s.values())
        });


        for(let x=0; x<formattedSet.length; x++){
            if (formattedSet[x].quantity === "kg" || formattedSet[x].quantity === "lt") {
                inputValArray[x] = (inputValArray[x] / 1000) * amountOfMultiplication;
            }
            else if (formattedSet[x].quantity === "tane") {
                inputValArray[x] *= amountOfMultiplication;
            }
            preventArr.push({ data: formattedSet[x], willBeConsumed: inputValArray[x] });
        }

        for(let z=0; z<preventArr.length; z++){
            if(preventArr[z].data.unit < preventArr[z].willBeConsumed){
                if(blacklistedItems.some(obj => obj["item_name"] === preventArr[z].data.item_name)) return;
                isConsumable = false;
                setBlacklistedItems(prevItems => [...prevItems, preventArr[z].data]);
            }
        }

        
        
        if(!isConsumable || isConsumable === false){
            setSelectedItemName(new Set());
            setFormattedSelectedItemName(new Array());
            window.scrollTo(0, 0);
            return;
        }
        /*        
                for(const item of selectedItemName)
                {
                    let i = [...selectedItemName].indexOf(item);
                    setTimeout(() => {
                        if(item && JSON.parse(String(item)).quantity === "kg"){
                            setUnit([...unit, (inputValArray[i] /1000) * amountOfMultiplication]);
                        }
                        else{
                            setUnit([...unit, inputValArray[i]]);
                        }
                        
                    }, i * 1000);
        
                }
        */
        /* 
         let newArr = Array.from(selectedItemName);
         for(let i=0; i<newArr.length; i++)
         {
             if(JSON.parse(newArr[i]).quantity === "kg"){
                 
                 
             }
             else{
                 setUnit(inputValArray[i]);
                     
             }
 
             setTimeout(() => {
                 console.log(unit);
             }, i * 1000);
             
         }
 */



        //for(let i=0; i < Array.from(selectedItemName).length; i++)
        //console.log(JSON.parse(Array.from(selectedItemName)[i]));

        console.log(amountOfMultiplication);
        for (let i = 0; i < inputValArray.length; i++) {
            const formattedSet = [...selectedItemName].map((item) => {
                if (typeof item === 'string') return JSON.parse(item);
                else if (typeof item === 'object') return item;

                //JSON.stringify(Array.from(s.values())
            });
            //console.log(formattedSet);
            if (i >= formattedSet.length) return;

            
            const ee = setTimeout(() => {
                if (formattedSet[i].quantity === "kg" || formattedSet[i].quantity === "lt") {
                    inputValArray[i] = (inputValArray[i] / 1000) * Number(amountOfMultiplication);
                }
                else if (formattedSet[i].quantity === "tane") {
                    inputValArray[i] *= Number(amountOfMultiplication);
                }
                
                
                axios.put(`http://localhost:5500/depo/update/${formattedSet[i].id}`, {
                    "unit": preventArr[i].willBeConsumed,
                    "portionNumber": 1
                }, {
                    withCredentials: true,
                    headers: {
                        "Role": user.resp.data.user.user_role
                    }
                }).then(
                    res => { setUpdatedItems([...updatedItems, res.data]); }
                ).catch(err => {
                    console.log(err);
                    if(err.response && err.response.data){
                        setErrorMessage(err.response.data.message);
                        window.scrollTo(0, 0);
                        return;
                    }
                })
                
            }, i * 2000);

        }

    }



    useEffect(() => {
        setNumberOfUpdatedItems(prev => prev + 1);
        //console.log(numberOfUpdatedItems," ", formattedSelectedItemName[numberOfUpdatedItems - 1]);
        const formattedSet = [...selectedItemName].map((item) => {
            if (typeof item === 'string') return JSON.parse(item);
            else if (typeof item === 'object') return item;

            //JSON.stringify(Array.from(s.values())
        });
        let newArr = new Array();
        formattedSet.forEach(item => newArr.push(item));
        newArr.pop();
        setSelectedItemName(new Set(newArr));
        setFormattedSelectedItemName(newArr);
    }, [updatedItems])



    const handleInputChange = (value, key) => {
        console.log(value, " ", key);
        let newArr = new Array();
        newArr[key] = value;
        setInputValArray(newArr);
        //bu value inputValArray e aktarıldığınd
        //setInputValArray(prevArrays => [...prevArrays, value]);
        /*
        setInputValArray(prevArrays => {
        const newArrays = [...prevArrays];
        newArrays[arrayIndex][valueIndex] = value;
        return newArrays;
        });
        */
    };


    function deepCopySet(set) {
        return new Set(JSON.parse(JSON.stringify([...set])));
    }


    const dropItem = async (id) => {
        //event.preventDefault();

        //console.log(id);
        setFormattedSelectedItemName(items => items.filter((item) => item.id != id));
        //console.log(formattedSelectedItemName);
        if (formattedSelectedItemName.length <= 0) {
            setSelectedItemName(new Set());
            setFormattedSelectedItemName(new Array());
        }
        else {
            //console.log(`Burada id=${id}'li ürünü selectedItems ten düşürürsek tamam mı?`);
            //console.log(selectedItemName);
            let formattedSet = [...selectedItemName].filter((item) => {
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
            setSelectedItemName(new Set(newArr));
        }



        //setSelectedItemName(new Set([...selectedItemName].filter(item => item.id !== id)))
        /*
         setSelectedItemName(items => Array.from(items));
         const formattedSet = [...selectedItemName].filter((item) => {
             //if (typeof item === 'string') return JSON.parse(item);
             //else if (typeof item === 'object') return item;
             return item.id == id;
             //JSON.stringify(Array.from(s.values())
         });
 */
        //properly set selectedItemNames
        /*
        for(let i=1; i<Array.from(selectedItemName).length; i++)
        {
          console.log(JSON.parse(Array.from(selectedItemName)[i]));
          let newState = Array.from(selectedItemName)
        }
        */


        //const updatedSet = new Set([...selectedItemName, newState]);

        //setSelectedItemName(new Set(newState));
        //console.log(selectedItemName);

    }
    /*
    const formattedSet = [...set].map(item) => {
      if (typeof item === 'string') return JSON.parse(item);
      else if (typeof item === 'object') return item;
    });
    */



    const onChangeHandler = (event) => {

        //const updatedSet = new Set([...selectedItemName, item]);
        // Update state with the new set
        //setSelectedItemName(updatedSet);

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

                const updatedSet = new Set([...selectedItemName, JSON.stringify(response.data)]);
                // Update state with the new set
                setSelectedItemName(updatedSet); //formattedSelectedItemName ile farkını almayı deneyelim, formattedSelectedItemName ile eşleyelim
                // burada, formattedSelectedItemName nin büyüklüğü 


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

        /*
        setSelectedItemName(
            new Set([...selectedItemName, event.target.value])
        )
        
       
        setNumberOfForms(selectedItemName.size);
        */
        //console.log(formattedSelectedItemName);
    }



    useEffect(() => {
        if (inputValArray.length >= formattedSelectedItemName.length) return;
        //let paragraphs = document.getElementsByTagName('input');
        let paragraphs = document.querySelectorAll('input');
        let arr = new Array();
        paragraphs.forEach(item => arr.push(item.value));
        setInputValArray(arr);
    }, [formattedSelectedItemName, inputValArray]);


    useEffect(() => {

        const formattedSet = [...selectedItemName].map((item) => {
            if (typeof item === 'string') return JSON.parse(item);
            else if (typeof item === 'object') return item;
        });

        setFormattedSelectedItemName(formattedSet);
        //console.log(selectedItemName);

        /*
        console.log("paragraphs");
        console.log(inputValArray);
        */
        //console.log(selectedItemName);
        /*
        console.log("selectedItems: \n");
                console.log(Array.from(selectedItemName));
                console.log("formattedSelectedItemName: \n");
                console.log(formattedSelectedItemName.length);
 */
        /*
        let a = JSON.stringify(
          selectedItemName,
          (_key, value) => (value instanceof Set ? [...value] : value)
        );
        */

        //console.log(a);
        //console.log((JSON.parse(Array.from(selectedItemName)[0])).item_name);         
        /*
        for(let i=1; i<Array.from(selectedItemName).length; i++)
        {
          //console.log(JSON.parse(Array.from(selectedItemName)[i]));
          console.log();
        }
        */




    }, [selectedItemName]
    );
    // JSON.stringify(Array.from(s.values()));



    async function fetchItems() {
        const axiosInstance = axios.create({
            withCredentials: true, // Allow Axios to send cookies with requests
            headers: {
                "Role": user.resp.data.user.user_role
            }
        });

        // Now you can use axiosInstance instead of axios for making requests
        axiosInstance.get('http://localhost:5500/depo')
            .then(response => {
                // Handle successful response
                setItems(response.data)

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
    return (
        <div className='min-vh-100'>
            {blacklistedItems && blacklistedItems.length > 0 ? <>
                <div className="jumbotron-fluid bg-danger my-2 mx-2 rounded p-2">
                 Aşağıda bulunan ürünlerin miktarı hazırlanmak istenen menünün muhteva ettiği miktara iktifa etmemektedir. Lütfen porsiyon sayısını düşürünüz.   
                    <ul>
                    {blacklistedItems.map(item => 
                    <li>{item.item_name}</li>
                    )}
                    </ul>
                </div>
            </> : ""}
            {errorMessage ? <div className='alert alert-danger'>{ errorMessage }</div> : ""}

            <div className='container-fluid'>
             <div className={`jumbotron jumbotron-fluid bg-success my-5 mx-3 rounded m-2`}>
                <div className="row p-2 d-flex justify-content-center"><h3 className="text-danger">DİKKAT!</h3></div>
                 <div className="row p-2"><b>Aşağıdaki açılır menüden, bir öğün (porsiyon) yemekte yer alan malzemeleri arzu ettiğiniz sırada seçin. Daha sonra en altta bulunan metin kutusuna, yemeğin dağıtılacağı kişi sayısını girin.</b></div><br/>
                 <div className="row p-2"><b className="text-danger"><u>NOT:</u></b><p><b>Girilen erzak birimi "kg" olarak girilmişse, beklenen giriş birimi gramdır, "lt" olarak girilmişse beklenen giriş birimi mililitredir. Bu anlamda, ilgili erzağın birimi, litre veya kilogramsa, porsiyon başına düşen gram veya mililitreyi girmeniz beklenmektedir. En sonda yer alan metin/sayı kutusuna yemeğin dağıtılacağı girdiğiniz kişi sayısıyla az evvel bahsedilen miktar çarpılacak ve kilograma dönüştürüldükten sonra kayıttan düşülecektir.</b></p></div>
                 <div className='row p-2'><b>Örneğin, "Domates" için porsiyon başı olarak 100 gr girdiğimizi varsayalım, depoda da 10 kilogram bulunduğunu varsayalım. Eğer 10 kişilik yemek yapılacaksa 100 gr x 10 porsiyon = 1000 gram = 1 kilogram edecektir, ve önceden kayıtlı olan 10 kilogramdan 1 kilo düşülecektir, 10 - 1 = 9 kg kalacaktır. </b></div>   
                 <div className="row p-2"><b>Birimi "tane" olanlar için sadece porsiyon başına kaç "tane" malzeme düştüğünü girmek iktifa edecektir, girilen "tane" sayısı, porsiyon sayısıyla çarpılacaktır ve sistemden düşülecektir.</b></div>
            </div>
            </div>

            {items && items.length > 0 ? <>
                <div className="container border border-warning p-2" key={Math.floor(Math.random() * 100000000)}>
                    <div className='row-fluid my-6'>
                        <center className="my-6">
                            <div className='row-fluid'>
                                <h6 className="text-dark">{items.length > 0 ? "Bir öğünde kullanacak olduğunuz malzemeyi aşağıdaki açılır menüden seçin." : "Henüz hiç malzeme yok. Bu menü varolan malzemeleri listeleri gösterir."}</h6>
                                <select onChange={onChangeHandler} className='form-select border border-danger'>
                                <i className="bi bi-arrow-down-circle-fill"></i>
                                    <option>Lütfen bir ürün seçiniz</option>
                                    {items && items.map((value, key) => {
                                        return (
                                            <option id={value.id} key={Math.floor(Math.random() * 100000000)} value={value.id}>{value.item_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </center>
                    </div>

                    <div>

                    </div>

                </div>
                <div className='container-fluid'>
                    <form onSubmit={(event) => updateAllItems(event)}>
                        {
                            formattedSelectedItemName.length >= 1 && formattedSelectedItemName.map((value, key) => {
                                return (
                                    <>

                                        <center>
                                            <div key={key} className="jumbotron-fluid form-group bg-success col-8 my-2 border border-success p-3 rounded">
                                                <div className='row'>
                                                    <div style={{ marginLeft: '35%' }}>
                                                        <button type="button" onClick={() => { dropItem(value.id) }} className="btn btn-close" >X</button>
                                                    </div>
                                                    <div>Kalan güncel miktar: <span className="text-warning">{value.unit} {value.quantity}</span>
                                                    </div>
                                                </div>
                                                
                                                <label htmlFor={value.id} className="my-3"> Bir porsiyonda kaç gr? | kg? | lt? | tane? <b className='text-warning'>{value.item_name}</b>  kullanılıyor?</label>
                                                <input type="number" className="form-control my-2"
                                                    onChange={(e) =>
                                                        setInputValArray((prev) => {
                                                            prev[key] = e.target.value;
                                                            return [...prev];
                                                        })}
                                                    placeholder="Miktarı giriniz, yanlışlıkla eklediyseniz kapata (X) tıklayın." 
                                                    max={3000}
                                                    required />

                                            </div>
                                        </center>
                                    </>
                                )
                            })
                        }
                        <div className="row mx-5 p-0 my-2">
                            {
                                formattedSelectedItemName && formattedSelectedItemName.length > 0 ?
                                    <div className="row form-group">
                                        <label for="amountOfMultiplication"><b>Kaç porsiyon yemek dağıtılacak?</b></label>
                                        <input type="number" id="amountOfMultiplication" value={amountOfMultiplication} onChange={(e) => setAmountOfMultiplication(e.target.value)} min={1} max={500000} required />
                                        <button type="submit" className='btn btn-warning form'>EKSİLT</button>
                                    </div> : ""
                            }



                        </div>
                    </form>
                </div>
                <br></br>


            </> : <h1 className="text-danger">Ürün Bulunamadı. Lütfen <Link to="/additem"> ürün girişi</Link> yapınız.</h1>}
        </div>
    )
}

export default DropFoodItem;