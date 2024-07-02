import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/signup_component";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import AddItem from "./components/pages/ProcurementForm";
import Report from "./components/pages/ReportHome";
import Action from './components/pages/Pending';
import Error from "./components/pages/Error";
import VendorList from "./components/admin/vendor/Vendor";
import UserList from './components/admin/user/User';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import Layout from "./components/layout/Layout";
import Sop from "./components/admin/sops/MainSop";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' && !location.pathname.startsWith('/sign-in') && !location.pathname.startsWith('/sign-up')) {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/homepage';

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={isAuthenticated() ? <Navigate to={lastVisitedPage} /> : <Navigate to="/sign-in" />}
      />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              {/* User Pages */}
              <Route path="/homepage" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/itemlist" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/additem" element={<PrivateRoute><AddItem /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
              <Route path="/sop" element={<PrivateRoute><Sop /></PrivateRoute>} />
              {/* Admin Pages */}
              <Route path="/admin/userlist" element={<AdminRoute><UserList /></AdminRoute>} />
              <Route path="/admin/supplier" element={<AdminRoute><VendorList /></AdminRoute>} />
              <Route path="/admin/itemlist" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/pendingActionList" element={<AdminRoute><Action /></AdminRoute>} />

              <Route path="*" element={<PrivateRoute><Error /></PrivateRoute>} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
