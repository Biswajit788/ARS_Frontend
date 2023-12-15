import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

const AdminRoute = ({ children }) => {

    
    if (localStorage.getItem("token")) {
        var accessToken = localStorage.getItem("token");
        var decoded = jwt_decode(accessToken);
        if(decoded.role === "Admin"){
            return (
                <>
                    {children}
                </>
            );
        }else{
            Swal.fire({
                text:'You are not authorized. Please contact Admin!',
                icon: 'warning'
            })
            return <Navigate to="/homepage" />;
        }   
    }
    return <Navigate to="/sign-in" />;
    
};

export default AdminRoute;