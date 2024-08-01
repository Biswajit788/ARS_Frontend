import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const AdminRoute = ({ children }) => {

    
    if (localStorage.getItem("authToken")) {
        var accessToken = localStorage.getItem("authToken");
        var decoded = jwtDecode(accessToken);
        if(decoded.role === "Admin" || "Super Admin"){
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