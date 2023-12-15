import React from "react";
import "./App.css";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
// import UserDetails from "./components/userDetails";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import AddItem from "./components/pages/ProcurementForm";
import Report from "./components/pages/Report";
import Error from "./components/pages/Error";
import UserList from './admin/User';
import TestPage from "./components/pages/TestPage";
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path="/homepage" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/itemlist" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/additem" element={<PrivateRoute><AddItem /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />

        <Route path="/admin/userlist" element={<AdminRoute><UserList /></AdminRoute>} />

        <Route path="*" element={<PrivateRoute><Error /></PrivateRoute>} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
