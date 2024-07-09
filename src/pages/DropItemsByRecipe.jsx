import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DropItemsByRecipe = () => {
    const { user } = useAuth();
    const [listOfRecipes, setListOfRecipes] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [lastAddedRecipe, setLastAddedRecipe] = useState(null);
    const [numberOfPortions, setNumberOfPortions] = useState(0);
    const [isAnyChecked, setIsAnyChecked] = useState(false);
    const [updatedItems, setUpdatedItems] = useState([]);
    const [isNotAvailable, setIsNotAvailable] = useState([]);
    const [displayedOverflowMessage, setDisplayedOverflowMessage] = useState([]);
    
    const [subItems, setSubItems] = useState([]);

    
    
    

    useEffect(() => {
        if(selectedRecipes.length > 0){
            setIsAnyChecked(true);
        }
        //console.log("isAnyChecked ==>> ", isAnyChecked);        
    }, [selectedRecipes])
    




    useEffect(() => {
        axios.get('http://localhost:5500/recipe/fetchrecipes', {withCredentials: true, headers: {
            "Role": user.resp.data.user.user_role
        }}).then(resp => {
            if(resp.status === 200){
                setListOfRecipes(resp.data)
            }
        }).catch(err => console.log(err));    
    }, []);




    useEffect(() => {
        console.log(subItems);  
    }, [subItems]);


 




    function nestedLoopWithTimeout(outerLoopCount, innerLoopCount) {
        
        const delay = 1000; // 1 second delay
    
        for (let i = 0; i < outerLoopCount; i++) {
            setTimeout(() => {
                console.log(`Outer loop iteration: ${i}`);
                for (let j = 0; j < innerLoopCount; j++) {
                    setTimeout(() => {
                        console.log(`  Inner loop iteration: ${j}`);
                    }, j * delay); // Delay each inner loop iteration by `delay` milliseconds
                }
            }, i * outerLoopCount * delay); // Delay each outer loop iteration by `outerLoopCount * delay` milliseconds
        }
    }


    const addUpdatedItem = (item) => {
        setUpdatedItems((prevItems) => {
            const updatedItems = [...prevItems, item];
            return updatedItems;
        })
    }

    const calculateMaxAmount = (item) => {
        //first, calculate how much item left in warehouse
        //...
        //let willBeDropped = item
        

        
       
        //return item.quantityPerPortion;
    }



/*
    function checkForAvailability(selectedRecipes, numberOfPortions)
    {
        for(let x = 0; x < selectedRecipes.length; x++){
            for(let y=0; y < selectedRecipes[x].items.length; y++){
                axios.get(`http://localhost:5500/depo/${selectedRecipes[x].items[y].item_id}`, {withCredentials: true, headers:{"Role": user.resp.data.user.user_role}})
                .then(resp => {
                    console.log("Tokiomania Showdown");
                    
                    
                    let willBeDropped = 0;
                    if(numberOfPortions && numberOfPortions > 0){
                        if(selectedRecipes[x].items[y].unitPerPortion === "gram" || selectedRecipes[x].items[y].unitPerPortion === "ml")
                                willBeDropped = selectedRecipes[x].items[y].quantityPerPortion / 1000 * numberOfPortions;
                        else 
                                willBeDropped = selectedRecipes[x].items[y].quantityPerPortion * numberOfPortions;
                    }
                    alert(willBeDropped);
                    alert(resp.data.unit);
                    if(willBeDropped > resp.data.unit){
                        alert(`${selectedRecipes[x].items[y].item_name} malzemesinin miktarı, girilen porsiyon sayısını karşılamamaktadır.`);
                        setIsAvailable(false);
                    }
                    else{
                        setIsAvailable(true);
                    }

                    
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }

*/
    const createMessage = () => {
        console.log(isNotAvailable);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplayedOverflowMessage("");
        let items = [];
        let isConsumable = true;   
        //itemler için işlem başlar
        for(let i=0; i<selectedRecipes.length; i++){
            for(let j=0; j<selectedRecipes[i].items.length; j++){
                if(items.some(obj => obj['item_name'] === selectedRecipes[i].items[j].item_name)){
                    const updatedItems = items.map(itm => {
                        if(itm.item_id === selectedRecipes[i].items[j].item_id){
                            return {...itm, quantityPerPortion: Number(itm.quantityPerPortion) + Number(selectedRecipes[i].items[j].quantityPerPortion)}
                        }
                        else{
                            return itm;
                        }
                    })
                    items = updatedItems;
                }
                else{
                    items.push(selectedRecipes[i].items[j]);
                }
            }
        }
        //console.log(items);
        const enhancedItems = [];
        for(let x=0; x<items.length; x++){
            let willBeDropped = 0;
                    if(numberOfPortions && numberOfPortions > 0){
                        if(items[x].unitPerPortion === "gram" || items[x].unitPerPortion === "ml")
                                willBeDropped = items[x].quantityPerPortion / 1000 * numberOfPortions;
                        else 
                                willBeDropped = items[x].quantityPerPortion * numberOfPortions;
                    }

            await axios.get(`http://localhost:5500/depo/getItemByName/${items[x].item_name}`, {
                        withCredentials: true,
                        headers: {
                            "Role": user.resp.data.user.user_role
                        }
                    }).then(res => {
                        if(res.data)
                        {
                            console.log(items[x].item_name, " ", res.data.id);
                            enhancedItems.push({ data: items[x], willBeDropped: willBeDropped, remainedUnit: res.data.unit, actualId: res.data.id });
                        }
                        else{
                            enhancedItems.push({ data: null, willBeDropped: -1, remainedUnit: 0, actualId: -1 });
                        }    
                      }).catch(err => console.log(err));
            
            //items[x].quantityPerPortion

            /*
            await axios.get(`http://localhost:5500/depo/${items[x].item_id}`, {
                withCredentials: true,
                headers: {
                    "Role": user.resp.data.user.user_role
                }
            }).then(res => console.log(res)).catch(err => console.log(err));
            */
        }
        //enhancedItems içerisinde dön...

        //console.log(enhancedItems);
        


        for(let z=0; z<enhancedItems.length; z++){
            if(enhancedItems[z].willBeDropped > enhancedItems[z].remainedUnit){
                isConsumable = false;
                setDisplayedOverflowMessage(prevItems => [...prevItems, enhancedItems[z].data.item_name + " Malzeme miktarı yetersiz."]);
            }

            if(enhancedItems[z].data == null || enhancedItems[z].willBeDropped == -1){
                isConsumable = false;
                setDisplayedOverflowMessage(prevItems => [...prevItems, items[z].item_name + " veritabanında bulunamadı. Lütfen güncelleyin."]);
            }
        }
        
        //itemler için işlem biter

       
        if(isConsumable == false) {
            window.scrollTo(0, 0);
            return;
        }

        const delay = 2000;
        if(selectedRecipes.length === 0) return;
        
        for (let i = 0; i < selectedRecipes.length; i++) {
            setTimeout(() => {
                dropItem(selectedRecipes[i].id);
                //console.log(`Outer loop iteration: ${i}`);
                for (let j = 0; j < selectedRecipes[i].items.length; j++) {
                    setSubItems(prevItems => [...prevItems, selectedRecipes.items]);
                    setTimeout(() => {
                        //console.log(`  Inner loop iteration: ${j}`);
                        let toBeDropped = 1;
                        if(selectedRecipes[i].items[j].unitPerPortion === 'gram' || selectedRecipes[i].items[j].unitPerPortion === 'ml'){
                            //console.log(`kg per ${selectedRecipes[i].items[j].item_name}`, parseFloat(selectedRecipes[i].items[j].quantityPerPortion / 1000 * numberOfPortions).toPrecision(3));
                            toBeDropped = parseFloat(selectedRecipes[i].items[j].quantityPerPortion / 1000 * numberOfPortions).toPrecision(3);
                        }
                        else{
                            toBeDropped = selectedRecipes[i].items[j].quantityPerPortion * numberOfPortions;
                        }
                        //console.log("for item of ", selectedRecipes[i].items[j].item_name, " calculated amount is ", toBeDropped);
                        //console.log(selectedRecipes[i].items[j].item_id);


                        axios.put(`http://localhost:5500/depo/updateByName/${selectedRecipes[i].items[j].item_name}`, {
                            "unit": toBeDropped,
                            "portionNumber": 1
                        }, {
                            withCredentials: true,
                            headers: {
                                "Role": user.resp.data.user.user_role
                            }
                        }).then(
                            res => { 
                                //console.log(res);
                                //setUpdatedItems([...updatedItems, selectedRecipes[i].items[j].item_name])
                                addUpdatedItem({cook_name: selectedRecipes[i].cook_name, item_name: selectedRecipes[i].items[j].item_name, state: 1, message: "Güncelleme Başarılı"});
                            }
                        ).catch(err => {
                            console.log(err);
                            addUpdatedItem({cook_name: selectedRecipes[i].cook_name, item_name: selectedRecipes[i].items[j].item_name, state: 0, message: "Güncelleme Başarısız"});
                        })





                    }, j * delay); // Delay each inner loop iteration by `delay` milliseconds
                    
                }
                let recArr = new Array();
                recArr.push(selectedRecipes[i]);
                axios.post('http://localhost:5500/menu-view', {recipes: [selectedRecipes[i]], number_of_portions: numberOfPortions}, 
                {
                    withCredentials: true,
                    headers: {
                        "Role": user.resp.data.user.user_role
                    }
                }
                ).then(resp => {
                    //console.log(resp);
                }).catch(err => {
                    console.log(err);
                })


            }, i * selectedRecipes[i].items.length * delay); // Delay each outer loop iteration by `outerLoopCount * delay` milliseconds
        }
        /*
        for(let i=0; i<selectedRecipes.length; i++){    
            (function(i){
                setTimeout(() => {
                    for(let j=0; j < selectedRecipes[i].items.length; j++){
                        (function(j) {
                            setTimeout(function() {
                                console.log(selectedRecipes[i].items[j]);
                            }, j * 1000)
                        })(j);
                    }
                }, i * 1000);
            })(i);//setTimeout(() => {}, 1000);        
                
        }
        /*
        for (let i = 0; i < 5; i += 1) {
            (function(i) {
                setTimeout(function() {
                    console.log("i =>> ", i, " -->> ", new Date());
                }, i * 1000)
            })(i);
        }
        */
    }




    const handleSelect = async (e) => {
        setDisplayedOverflowMessage(null);
        //console.log(e.target.value);
        await axios.get(`http://localhost:5500/recipe/${e.target.value}`, {
            withCredentials: true,
            headers:{
                "Role": user.resp.data.user.user_role
            }
        }).then(resp => {
            //console.log(resp);
            if(resp.status === 200){
                for(let i=0; i<selectedRecipes.length; i++){
                    if(selectedRecipes[i].cook_name === resp.data.cook_name){
                        return;
                    }
                }
                /*
                console.log(resp.data.items.length);
                resp.data.items.forEach((val) => {

                            if(subItems.some(obj => obj['item_name'] === val.item_name)){
                                
                                const updatedItems = subItems.map(item => 
                                    //(item.item_name === val.item_name) ? { ...item, quantityPerPortion: Number(item.quantityPerPortion) + Number(val.quantityPerPortion) } : item                                   
                                    {
                                        if(item.item_name === val.item_name){
                                            return { ...item, quantityPerPortion: Number(item.quantityPerPortion) + Number(val.quantityPerPortion) };
                                        }
                                        else{
                                            return item;
                                        }
                                        setSubItems(prevItems => [...prevItems, item]);
                                    }
                                  );
                                  //console.log(updatedItems);
                                  setSubItems(updatedItems);
                                      
                            }//Eğer bu şart doğruysa, bu itemin unitPerPortion'unu, val'inkiyle topla ve return et.
                            else{
                                setSubItems(prevItems => [...prevItems, val]);
                            }
                        
                                  
                        
                    
                    //setSubItems(prevItems => [...prevItems, val]);
                })*/
                setSelectedRecipes([...selectedRecipes, resp.data]);
            }
        }).catch(err => {
            console.log(err);
        })
        
    }

    const dropItem = (id) => {
        setDisplayedOverflowMessage(null);
        setSelectedRecipes(item => item.filter(it => it.id !== id));
        ///////////////////////////
        /* setRemainderItems, setSelectedRecipes ile aynı anda item yok etmeli, yoksa işimiz yalan olur!!!!!!!!!!  */
        //////////////////////////
        //setRemainedItems(item => item.filter(item.data.item_id!== id));
        
    }


    /*
    useEffect(() => {
        const newRemainedItems = [];
        const copiedRemainedItems = [];
        let itemNames = new Set();
        for (let i = 0; i < selectedRecipes.length; i++) {
            for (let j = 0; j < selectedRecipes[i].items.length; j++) {
                try {
                    const resp =  axios.get(`http://localhost:5500/depo/${selectedRecipes[i].items[j].item_id}`, {
                        withCredentials: true,
                        headers: { "Role": user.resp.data.user.user_role }
                    });

                    let willBeDropped = 0;
                    let repeatedWillBeDropped = 0;
                    if (numberOfPortions) {
                        if (selectedRecipes[i].items[j].unitPerPortion === "gram" || selectedRecipes[i].items[j].unitPerPortion === "ml") {
                            willBeDropped = selectedRecipes[i].items[j].quantityPerPortion / 1000 * numberOfPortions;
                        } else {
                            willBeDropped = selectedRecipes[i].items[j].quantityPerPortion * numberOfPortions;
                        }

                        //console.log("Item name = ", selectedRecipes[i].items[j].item_name, " Amount of dropped in kg = ", willBeDropped);
                        resp.then(rs => {
                           
                           
                            
                            
                            newRemainedItems.push({ data: rs.data, willBeDropped });
                            let totalWillBeDropped = 0;
                            for(let i=0; i<newRemainedItems.length; i++)
                            {
                                for(let j=0; j<newRemainedItems.length; j++){
                                    if(i == j) continue;
                                    //console.log(`i = ${i}, j=${j}`);   
                                    //console.log(newRemainedItems[i].data, " ", newRemainedItems[j].data);
                                    if(newRemainedItems[i].data.item_name === newRemainedItems[j].data.item_name){

                                        newRemainedItems[i].willBeDropped += newRemainedItems[j].willBeDropped;
                                        //console.log(newRemainedItems[j].data);
                                        newRemainedItems.splice(j, 1);
                                        
                                        //totalWillBeDropped += newRemainedItems[i].willBeDropped;
                                        //console.log(totalWillBeDropped);
                                        //console.log("i => ", i, "j => ", j);
                                        continue;
                                        //Bu elemanı newRemainedItems içerisinde bul, repeatedWillBeDropped hesabını yap, birisine yapıştır, diğerini düşür
                                    }
                                    else{
                                        totalWillBeDropped = willBeDropped;
                                    }
                                }
                            }
                        });

                        
                    }
                } catch (error) {
                    console.error("Error fetching data:", error.message);
                }
            }
        }
        setRemainedItems(newRemainedItems);
    }, [numberOfPortions]);
    */

  

    useEffect(() => {
        setDisplayedOverflowMessage(null);
    }, [numberOfPortions])

    const handleInputChange = async (e) => {
        setNumberOfPortions(e.target.value);
    }





    return(
        <>
        { displayedOverflowMessage && displayedOverflowMessage.length > 0 ? 
        <div className="m-2">
        <div className="jumbotron-fluid my-2 bg-danger rounded p-2">
            <p>Tariflerdeki malzemelerle alakalı bazı problemler bulundu. Lütfen aşağıdaki yönergelere göre tarif siliniz veya porsiyon sayısı değiştiriniz.</p>
            {displayedOverflowMessage.map(item => {
                return (<ul>
                    <li>{item}</li>
                </ul>)
            })}
        </div> 
        </div>
        : ""}
            { listOfRecipes.length > 0 ? 
            <div className='container-fluid min-vh-100'>
                <div className="jumbotron-fluid text-center bg-warning my-3 rounded p-2">
                    <h6>Bu sayfanın amacı, önceden girilmiş yemek tariflerinde yer alan bilgiler kullanılarak malzeme bilgilerinin tutulduğu tablodan <u>toplu</u> olarak malzeme azaltmaktır. Tekil olarak sunulacak malzemelerin sistemden düşürülmesi işlemini (örneğin yoğurt, ayran vs.) <Link to='/dropitem'>bu sayfadan</Link> gerçekleştirebilirsiniz. En önemli husus, tarif girerken porsiyon başına düşecek olan birim miktarın doğru bir şekilde girilmiş olmasıdır.</h6>
                    <form className='form' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <select onChange={handleSelect} className='form-select form-select-md border border-danger'>
                            <option>Yemekte kullanacağınız malzemeleri alttaki açılır menüden seçiniz</option>
                        {listOfRecipes && listOfRecipes.map((item) => {
                            return (
                                <option key={Math.floor(Math.random() * 10000000000)} value={item.id}>{item.cook_name}</option>
                            )
                        })}
                        </select>
                    </div>

                     

                     { selectedRecipes.map((value, key) => {
                    return(
                        <>
                        
                        <div className="jumbotron-fluid my-2 rounded bg-success text-light" key={key}>
                        <div style={{ marginLeft: '90%' }}>
                                                        <button type="button" onClick={() => { dropItem(value.id) }} className="btn btn-close" >X</button>
                            </div>
                            <div className="row p-2">
                                <div className="col-3">
                                    <h6>Yemek İsmi:</h6>
                                    <p>{value.cook_name}</p>
                                </div>

                                <div className="col-3">
                                    <h6>Açıklama:</h6>
                                    <p>{value.description}</p>
                                </div>

                                <div className="col-3">
                                    <h6>Kullanılan malzemeler (Kişi başı):</h6>
                                    <ul>
                                        {value.items && value.items.map(item => {
                                            return(
                                                <li key={Math.floor(Math.random() * 1000000000)}>{item.item_name} {item.quantityPerPortion} {item.unitPerPortion}</li>
                                            )
                                        })}
                                    </ul>
                                </div>


                                
                            </div>
                        </div>
                        </>
                    )
                })}

                {selectedRecipes && selectedRecipes.length > 0 ? 
                <>                <div className="form-group">
                    <label htmlFor="numberOfPortion"><b>Lütfen kaç kişilik yemek yapacağınızı yazınız:</b> </label>
                    <input type="number" id="numberOfPortion" className="form-control border border-danger" value={numberOfPortions} min={1} max={50000} onChange={handleInputChange} required/>
                </div>
                <input type='submit' value="EKSİLT" id="submit" className='btn btn-md btn-block btn-success my-4'/>   
                </> : ""}


                    </form>
                    {updatedItems && updatedItems.length > 0 ? <button className="btn btn-info my-2" onClick={() => setUpdatedItems([])}>TEMİZLE</button> : ""}
                    {updatedItems && updatedItems.map(item => {
                        return item.state === 1 ? <div className='jumbotron-fluid bg-success text-light my-2 rounded'>
                            <div className="row">
                            <div className="col-4">
                                <b>Yemek İsmi:</b><br/>
                                <b>{item.cook_name}</b>
                            </div>
                            <div className="col-4">
                                <b>Malzeme İsmi:</b><br/>
                                <b>{item.item_name}</b>
                            </div>
                            <div className="col-4">
                                <b>Güncelleme Durumu:</b><br/>
                                <b>{item.state === 1 ? "Başarılı" : "Başarısız"}</b>
                            </div>               
                            </div>             
                        </div> : <div className='jumbotron-fluid bg-danger text-light my-2 rounded'>
                            <div className="row">
                            <div className="col-4">
                                <b>Yemek İsmi:</b><br/>
                                <b>{item.cook_name}</b>
                            </div>
                            <div className="col-4">
                                <b>Malzeme İsmi:</b><br/>
                                <b>{item.item_name}</b>
                            </div>
                            <div className="col-4">
                                <b>Güncelleme Durumu:</b><br/>
                                <b>{item.state === 1 ? "Başarılı" : "Başarısız"}</b>
                            </div>               
                            </div>   
                        </div>
                       
               })}
                </div>
            </div>

          : <div className='jumbotron-fluid my-3 min-vh-100'>Listenizde hiç tarif bulunamadı.</div> }     
        </>
    )
};

export default DropItemsByRecipe;