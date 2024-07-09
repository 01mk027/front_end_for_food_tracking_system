import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import stopGenocide from '../images/stop_genocide.jpg'
import hadiths from '../hadithes/hadithes.json'
import bgImage from '../images/elazig_big.jpg';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout, csrf } = useAuth();
    const [hadithIndex, setHadithIndex] = useState(0);


//user.resp.data.user.usernam

    useEffect(() => {
        const randomHadithIndexGenerate = setInterval(() => {
            setHadithIndex(Math.floor(Math.random() * hadiths.length));
        }, 5000);

        return () => clearInterval(randomHadithIndexGenerate);
    }, [hadithIndex])

    const test = async () => {
        try{
        await axios.get('http://localhost:5500/users', {
            withCredentials: true,
            headers:{
                "role": user.resp.data.User.user_role
            }
        }).then(resp => console.log(resp))//.catch((err) => console.error(err));
    }catch(e){
        console.log(e);
    }
    };

    
    return (
        <div className="min-vh-100" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="bg-image border border-light">
          <img
            src={bgImage}
            alt="Background"
            style={{
              width: '100%',
              height: '600px',
              margin: 0,
              padding: 0,
              filter: 'brightness(0.6)',
              position: 'relative',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              color: 'white', // Text color
              textAlign: 'center',
              padding: '10px', // Padding for the text
              //backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            }}
          >
            <h1><u>ELAZIĞ BELEDİYESİ</u></h1>
            <p>AŞEVİ ERZAK TAKİP PROGRAMI</p>
          </div>
        </div>


        <div className="jumbotron-fluid bg-success p-4">
            <div className='text-center'>
                <h4 className="text-light">KULLANICI BİLGİLERİ</h4>
            </div>
            <div className="d-flex flex-column text-center text-light">
                <div className="p-2"><b>Kullanıcı İsmi</b>: {user.resp.data.user.username}</div>
                <div className="p-2"><b>Tam isim</b>: {user.resp.data.user.full_name}</div>
                <div className="p-2"><b>Adres</b>: {user.resp.data.user.address}</div>
                <div className="p-2"><b>Telefon</b>: {user.resp.data.user.phone}</div>
                <div className="p-2"><b>Mail</b>: {user.resp.data.user.mail}</div>
                <div className="p-2"><b>Kayıt Tarihi</b>: {user.resp.data.user.created_at}</div>
                <div className="p-2"><b>Kullanıcı Rolü</b>: {user.resp.data.user.user_role == 1 ? "Admin" : "Kullanıcı"}</div>
                <div className="p-2"><b>Süper Admin mi?</b> {user.resp.data.user.is_super_admin == 1 ? "Evet" : "Hayır"}</div>
                <div className="p-2"><b>Son güncelleme</b>: {user.resp.data.user.updated_at ? user.resp.data.user.updated_at : "Henüz güncelleme yapılmamış"}</div>
            </div>
        </div>    

        <div className="jumbotron-fluid bg-warning text-center p-2">
            <h5>BAĞLANTILAR</h5>
            <p className="my-2">Personellerimizin kullanabileceği bağlantılar aşağıda yer almaktadır.</p>
                <div className="container-fluid">
                        <div className='row'>
                        <div className="col-4">
                            <div className="col-12 mb-2">
                                <Link className="btn btn-primary btn-sm" target='_blank' to="https://posta.elazig.bel.tr/">POSTA</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-danger btn-sm" target='_blank' to="http://10.1.1.120/gir/index.php">SAYSİS</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-success btn-sm" target='_blank' to="https://giris.belediye.gov.tr/Login.aspx?IsApplicationRequest=true">EBYS</Link>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="col-12 mb-2">
                                <Link className="btn btn-primary btn-sm" target='_blank' to="https://ebys.elazig.bel.tr/">ESKİ EBYS</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-danger btn-sm" target='_blank' to="https://cbs.elazig.bel.tr/cbsportal/anasayfa">CBS PORTAL</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-success btn-sm" target='_blank' to="https://kapi.cimer.gov.tr/hesap/giris?adres=%2F">CİMER</Link>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="col-12 mb-2">
                                <Link className="btn btn-primary btn-sm" target='_blank' to="https://ebelediye.elazig.bel.tr/webportal/index.php?wwsayfa=25">E-BELEDİYE</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-danger btn-sm" target='_blank' to="https://ebelediye.elazig.bel.tr/webportal/index.php?wwsayfa=8888">BORDRO</Link>
                            </div>
                            <div className="col-12 mb-2">
                                <Link className="btn btn-success btn-sm" target='_blank' to="http://212.156.93.206:8888/gir/index.php">SAYSİS DIŞ</Link>
                            </div>
                        </div>



                </div>
                <div className='container-fluid'>
                            <div className="col-12 mb-2">
                                    <Link className="btn btn-primary btn-sm" target='_blank' to=" https://portal.elazig.bel.tr/rehber-2020.pdf">REHBER</Link>
                            </div>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Profile;