import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const useAuth = () => {
    var accessToken = window.localStorage.getItem("token");
    var decoded = jwt_decode(accessToken);

    if(accessToken){
        if(decoded.role === "Admin"){
            return {
                auth: true,
                role: 'Admin'
            }
        }else{
            return {
                auth: true,
                role: null
            }
        }
    }else{
        return {
            auth: false,
            role: null
        }
    }
} 

const ProtectedRoute = (props) => {
    const {auth, role} = useAuth()
    return auth && role ? <Outlet /> : <Navigate to="/dashboard" />
}
export default ProtectedRoute;