import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
// import UserDetails from "./components/userDetails";
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
import TestPage from './components/pages/DateRangeFilter';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* User Pages */}
        <Route path="/homepage" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/itemlist" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/additem" element={<PrivateRoute><AddItem /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
        <Route path="/test" element={<PrivateRoute><TestPage /></PrivateRoute>} />
        {/* Admin Pages */}
        <Route path="/admin/userlist" element={<AdminRoute><UserList /></AdminRoute>} />
        <Route path="/admin/supplier" element={<AdminRoute><VendorList /></AdminRoute>} />
        <Route path="/admin/itemlist" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/pendingActionList" element={<AdminRoute><Action /></AdminRoute>} />

        <Route path="*" element={<PrivateRoute><Error /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
