import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const useAuth = () => {
    const user = window.localStorage.getItem("token");
    if (user){
        return {
            auth: true
        }
    }else{
        return {
            auth: false
        }
    }
} 

const PrivateRoute = () => {

    const auth = useAuth()
    return auth ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute
