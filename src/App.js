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
import Error from './components/pages/Error';
import UserList from './admin/User';
import PrivateRoutes from './utils/PrivateRoutes';
import AdminRoutes from "./utils/ProtectedRoutes";
import TestPage from "./components/pages/TestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route element={<PrivateRoutes />}>
          <Route path="/homepage" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/additem" element={<AddItem />} />
          <Route path="/report" element={<Report />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/admin/userList" element={<UserList />} />
        </Route>
        <Route path="*" element={<Error />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
