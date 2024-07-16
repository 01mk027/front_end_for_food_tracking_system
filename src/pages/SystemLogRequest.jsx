import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';


const SystemLogRequest = () => {


    const {user} = useAuth();
    const [firstDate, setFirstDate] = useState('');
    const [secondDate, setSecondDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logRecs, setLogRecs] = useState([]);
    const [types, setTypes] = useState([]);
    const [users, setUsers] = useState([]);


    const onChangeHandlerForType = async (e) => {
        setLogRecs(null);
        await axios.post('http://localhost:5500/logger/getlogsbytype', {body: e.target.value}, {withCredentials: true, headers:{
            "Role": user.resp.data.user.user_role
        }}).then(res => {
            
            setLogRecs(res.data);
        }).catch(err => console.log(err));
    }

    const onChangeHandlerForUser = async (e) => {
        
        setLogRecs(null);
        await axios.post('http://localhost:5500/logger/getlogsbyuser', {username: e.target.value}, {withCredentials: true, headers: {
            "Role": user.resp.data.user.user_role
        }}).then(resp => {
            console.log("TRR");
            console.log(resp);
            //setLogRecs(resp.data);
        }).catch(err => {
            console.log(err);
        })
        
    }

    useEffect(() => {
        axios.get('http://localhost:5500/users/getusers', {withCredentials: true, headers: {
            "Role": user.resp.data.user.user_role
        }}).then(resp => {
            setUsers(resp.data);
        }).catch(err => console.log(err));
    }, [])

    useEffect(() => {
         axios.get('http://localhost:5500/logger/gettransactiontypes', {
            withCredentials: true,
            headers: {
                "Role": user.resp.data.user.user_role
            }
         }).then(res => {
            setTypes(res.data);
        }).catch(err => console.log(err));
    }, [])

    const fetchDataByDate = async (e) => {
        setLogRecs(null);
        e.preventDefault();
        if(firstDate > secondDate || firstDate == secondDate){
            alert("Birinci tarih, ikinci tarihten küçük olarak seçilmemelidir, veya her iki tarih eşit olarak seçilmemelidir.");
            return;
        }
        else if(moment(secondDate).diff(moment(firstDate), 'days') > 7){
            alert("Görüntülenmesi istenen zaman aralığı çok büyük. Azami 7 gün olarak tayin edilmiştir.");
            return;
        }
/*
{
    "id": 2,
    "host": "::ffff:127.0.0.1",
    "transaction": "Kullanıcı ekleme",
    "message": "::ffff:127.0.0.1 ip numaralı cihazdan  neverrun isminde, Admin düzeyinde, bir kullanıcı eklemesi gerçekleştirdi.",
    "type": "Kullanıcı ekleme",
    "created_at": "2024-06-20 22:57:20"
}
*/
        await axios.post('http://localhost:5500/logger/logsinbetweentwodates', {firstDate: firstDate, secondDate: secondDate}, {
            withCredentials: true,
            headers: {
                "Role": user.resp.data.user.user_role
            }
        }).then(res => {
            console.log(res);
            setLogRecs(res.data);
        }).catch(err => console.log(err));
    }

    return(
        <>
            <div className="container-fluid my-4 rounded p-1 text-center min-vh-100">
                <p>Tüm olay listeleme aralıkları, sistemin selahiyeti açısından <u><b>7 gün</b></u> olarak belirlenmiştir.</p>
            <div className='border border-danger rounded'>      
            <h5>İKİ TARİH ARASI SIRALAMA</h5>  
            <p>Aşağıda bulunan tarihlerin arasında, maksimum <b><u>7 günlük</u></b> zaman mesafesi bulunması kaydıyla olay günlükleri listelenebilmektedir.</p>    
                <form onSubmit={(e) => fetchDataByDate(e)}>
                    <div className="form-control row-fluid bg-warning my-2">
                    <label htmlFor="datepicker">Lütfen birinci tarihi seçiniz: </label>    
                    <input type="date" className="form-control" value={firstDate} onChange={(e) => {setFirstDate(e.target.value)}} required/>
                    </div>


                    <div className="form-control row-fluid bg-warning my-2">
                    <label htmlFor="datepicker">Lütfen ikinci tarihi seçiniz: </label>    
                    <input type="date" className="form-control" value={secondDate} onChange={(e) => {setSecondDate(e.target.value)}} required/>
                    </div>



                    <button className="btn btn-success" type="submit">LİSTELE</button>
                </form>
            </div>

            <div className='border border-danger rounded text-center my-3'>
                <h5>İŞLEM TİPİNE GÖRE SIRALAMA</h5>
                <select onChange={onChangeHandlerForType} className='form-select border border-danger'>
                                <i className="bi bi-arrow-down-circle-fill"></i>
                                    <option>Lütfen işlem tipi seçiniz</option>
                                    {types && types.map((value, key) => {
                                        return (
                                            <option id={value} key={Math.floor(Math.random() * 100000000)} value={value.logs_type}>{value.logs_type}</option>
                                        )
                                    })}
                                </select>
            </div>


            <div className='border border-danger rounded text-center my-3'>
                <h5>KULLANICI İSMİNE GÖRE SIRALAMA</h5>
                <select onChange={onChangeHandlerForUser} className='form-select border border-danger'>
                                <i className="bi bi-arrow-down-circle-fill"></i>
                                    <option>Lütfen işlem tipi seçiniz</option>
                                    {users && users.map((value, key) => {
                                        return (
                                            <option id={value.users_user_name} key={Math.floor(Math.random() * 100000000)} value={value.users_user_name}>{value.users_user_name}</option>
                                        )
                                    })}
                                </select>
            </div>


            {logRecs && logRecs.length > 0 ? 
            
            <table class="table table-sm table-fluid my-4">
            <thead>
                <tr>
                <th scope="col">Host</th>
                <th scope="col">İşlem</th>
                <th scope="col">Mesaj</th>
                <th scope="col">İşlem Tarihi</th>
                </tr>
            </thead>
            <tbody>
                {logRecs && logRecs.map(item => {
                return (<tr>
                <td>{item.host}</td>
                <td>{item.transaction}</td>
                <td>{item.message}</td>
                <td>{item.created_at}</td>
                </tr>)
                })}

            </tbody>
            </table>

            : <b>Seçili kriterde kayıt bulunamadı.</b>}
            </div>
        </>
    )
};

export default SystemLogRequest;