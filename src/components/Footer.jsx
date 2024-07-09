import React from 'react';
import logo from '../images/eb-logo.png'
import facebookIcon from '../social-media-icons/facebook.svg';
import twitterIcon from '../social-media-icons/twitter.svg';
import youtubeIcon from '../social-media-icons/youtube.svg'
import { Link } from 'react-router-dom';

const Footer = () => {
    return(
        <>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-0 border-top bg-primary">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-flex align-items-center">
            
            <img className='img-fluid p-2' src={logo}/>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12  justify-content-between align-items-center">
                <h6 className="text-light">Elazığ Belediyesi Bilgi İşlem Müdürlüğü ®</h6>
                <small className="text-light">Elazığ Belediyesi Hayır Çarşısı projesi için geliştirilmiştir.</small>
            </div>


            <ul className="nav col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12  align-items-center justify-content-between list-unstyled d-flex p-2">
            <li className="ms-2"><Link to="https://www.facebook.com/elazigbeltr/" target='_blank'><img src={facebookIcon}  width={32} height={32}/></Link></li>
            <li className="ms-2"><Link to="https://x.com/elazigbld/" target='_blank'><img src={twitterIcon}  width={32} height={32}/></Link></li>
            <li className="ms-2 my-2"><Link to="https://www.youtube.com/@ElazgBelediyesi23" target='_blank'><img src={youtubeIcon}  width={32} height={32}/></Link></li>
            </ul>
        </footer>
        </>
    )
}

export default Footer;
