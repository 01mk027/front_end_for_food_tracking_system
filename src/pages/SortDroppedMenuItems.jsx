import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';


const SortDroppedMenuItems = () => {
    useEffect(() => {
        const onBeforeUnload = (ev) => {
          
          //#############     
          console.log("SOME CODE HERE");
          //#############
    
          ev.returnValue = "Anything you wanna put here!";
          return "Anything here as well, doesn't matter!";
        };
    
        window.addEventListener("beforeunload", onBeforeUnload);
    
        return () => {
          window.removeEventListener("beforeunload", onBeforeUnload);
        };
      }, []);
    const [date, setDate] = useState(new Date());
    const [presentedMenu, setPresentedMenu] = useState();
    const [isConfirmWindowShown, setIsConfirmWindowShown] = useState(false);

    const { user } = useAuth();
    const fetchDataByDate = async (e) => {
        console.log(date);
        e.preventDefault();
        await axios.post('http://localhost:5500/menu-view/sortbydate', {date: date}, {
            withCredentials: true,
            headers:{
                "Role": user.resp.data.user.user_role
            }
        }).then(resp => {
            console.log(resp);
            setPresentedMenu(resp.data);
        }).catch(err => console.log(err));
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsConfirmWindowShown(!isConfirmWindowShown);
        console.log(isConfirmWindowShown);
        let text = "Sunum silindikten sonra, malzeme listesinde oluşacak açığın kapatılması, kullanıcının/birim sorumlusunun ihtiyarındadır. Sunumu silmek istediğinizden emin misiniz?";
        window.confirm(text);
        if(window.confirm(text) == true)
        {            
            await axios.delete(`http://localhost:5500/menu-view/${e.target.value}`, {withCredentials: true, headers: {"Role": user.resp.data.user.user_role}})
                .then(resp => { 
                    console.log(resp);
                    
                    axios.post('http://localhost:5500/menu-view/sortbydate', {date: date}, {
                        withCredentials: true,
                        headers:{
                            "Role": user.resp.data.user.user_role
                        }
                    }).then(resp => {
                        console.log(resp);
                        setPresentedMenu(resp.data);
                    }).catch(err => console.log(err));
                    
                }).catch(err => { console.log(err); })  
            
        }
    }
    

    return(
        <>
            <div className="container-fluid min-vh-100 text-center">
            <form onSubmit={(e) => fetchDataByDate(e)}>
                <div className="form-control row-fluid bg-warning my-3">
                <b style={{ display: 'block' }}>Bu sayfada, aşağıdaki formdan girilmiş olan tarihte sunulmuş olan menülerin listelemesi yapılmaktadır.</b>    
                <label htmlFor="datepicker">Lütfen tarih seçiniz: </label>    
                <input type="date" className="form-control" value={date} onChange={(e) => {setDate(e.target.value)}} required/>
                </div>
                <button className="btn btn-bg btn-success" type="submit">ARA</button>
            </form>


            {presentedMenu && presentedMenu.length > 0 ? (presentedMenu.map((item) => {
                return (
                <div className="jumbotron-fluid my-3 bg-info rounded">
                    <div className="row p-2">
                        <div className="col-3">
                            <b style={{ display: 'block' }}>Yemek Adı:</b>
                            {item.recipes && item.recipes.map(it => it.cook_name)}
                        </div>

                        <div className='col-3'>
                            <b style={{ display: 'block' }}>Sunulduğu Tarih:</b>
                            {item.created_at}
                        </div>

                        <div className='col-3'>
                            <b style={{ display: 'block' }}>Kaç porsiyon: </b>
                            {item.number_of_portions}
                        </div>


                        {
                            user.resp.data.user.user_role == 1 ?                         <div className='col-3'>
                            <button className="btn btn-dark text-light" value={item.id} onClick={(e) => handleDelete(e)}>SUNUMU SİL</button>
                        </div> : ""
                        }

                    </div>
                </div>
                )
            })) : <div className="jumbotron-fluid bg-danger my-3 rounded text-light">Seçilen tarihte hiç sunum yapılmamış!</div>}
            </div>
        </>
    )
}

export default SortDroppedMenuItems;