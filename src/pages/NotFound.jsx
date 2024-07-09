import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NotFound = () => {
    const { user, isLoggedIn } = useAuth();
    if(!isLoggedIn || isLoggedIn === false){
        return <Navigate to="/login" />;
    }
    else{
        return <Navigate to='/profile' />
    }
}

export default NotFound;