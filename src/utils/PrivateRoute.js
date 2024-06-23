import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    if (!localStorage.getItem("authToken")) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <>
            {/* <AppSidebar /> */} {/* your other components */}
            {children}
                
        </>
    );
};

export default PrivateRoute;
