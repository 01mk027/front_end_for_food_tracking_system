import React, { useState } from "react";
import axios from 'axios';

import moment from "moment";
import { useAuth } from "../hooks/useAuth";




const SortUpdatedItemsByDate = () => {

    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [isDateChanged, setIsDateChanged] = useState(false);
    const [items, setItems] = useState([]);

    const fetchDataByDate = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:5500/updated_items/sortitemsbydate`, {
            date: moment(date).format('YYYY-MM-DD')
        }, {
            withCredentials: true, 
            headers:
            {"Role": user.resp.data.user.user_role}
        }).then(resp => {
            console.log(resp.data);
            setIsDateChanged(true);
            setItems(resp.data);
        }).catch(err => {
            console.error(err);
        })
    }


    

//2024-05-30 13:14:33

    return(
    <div className="container-fluid min-vh-100 text-center">
        <div className="jumbotron jumbotron-fluid bg-primary my-5 rounded">
            <b className="text-light">Bu sayfa içerisinde, erzakların <u>güncelleme yapıldığı tarihe göre sıralama</u> gerçekleştirilebilmektedir. Bilgiler salt okunur şekildedir, bu sayfa içerisinde değişiklik yapılmaması öngörülmüştür.</b>
            <form onSubmit={(e) => fetchDataByDate(e)}>
                <div className="form-control row-fluid bg-warning">
                <label htmlFor="datepicker">Lütfen tarih seçiniz: </label>    
                <input type="date" className="form-control" value={date} onChange={(e) => {setDate(e.target.value)}} required/>
                </div>
                <button type="submit">ARA</button>
            </form>
        </div>
        {
            isDateChanged && items.length == 0 ? 
            <div className="alert alert-danger">
                Seçilen tarihte hiç erzak tüketilmemiş.
            </div> : 
            items.map((value) => {
                return (<>
                <div className="row row-fluid bg-warning my-3 mx-4 rounded">
                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Ürün Adı: </b></div>
                        <div className="row-fluid">{value.item_name}</div>
                    </div>

                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Miktar: </b></div>
                        <div className="row-fluid">{value.unit}</div>
                    </div>

                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Birim: </b></div>
                        <div className="row-fluid">{value.quantity}</div>
                    </div>

                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Porsiyon: </b></div>
                        <div className="row-fluid">{value.portion}</div>
                    </div>

                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Porsiyon başı tüketilen miktar: </b></div>
                        <div className="row-fluid">{value.unit / value.portion} {value.quantity}</div>
                    </div>

                    <div className="col-2 text-center">
                        <div className="row-fluid"><b>Tüketildiği tarih: </b></div>
                        <div className="row-fluid">{value.updated_at}</div>
                    </div>
                </div>
                </>)
            })
        }
    </div>
    )
}

export default SortUpdatedItemsByDate;