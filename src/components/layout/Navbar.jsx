import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import User from '../../assets/user.png';
import Logo from '../../assets/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import Swal from 'sweetalert2';
import ProfileModal from './profileModal';
import ChangePasswordModal from "./ChangePasswordModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordChangeModal, setIsPasswordChangeModal] = useState(false);
  const [user, setUser] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");

        const decodedToken = parseJwt(token);
        setUser(decodedToken);

        if (decodedToken.role !== "Admin") {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }

      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserName();
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  const logout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be redirected to the login page',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('lastVisitedPage');
        navigate('/');
      }
    });
  };

  const alertMessage = () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'This page is under development'
    });
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openPasswordModal = () => {
    setIsPasswordChangeModal(true);
  }
  const closePasswordModal = () => setIsPasswordChangeModal(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavLink to="/homepage" className="navbar-brand mt-2 mt-lg-0">
              <img
                src={Logo}
                height="70"
                alt="NEEPCO Ltd."
                loading="lazy"
              />
            </NavLink>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/homepage" className="nav-link text-decoration-none">
                  <i className="fa fa-home" aria-hidden="true"></i>&nbsp;&nbsp;
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a href="#navbarDarkDropdownMenuLink" className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  User Panel
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                  <li>
                    <NavLink to="/additem" className="dropdown-item text-decoration-none">
                      Create New Asset
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/itemlist" className="dropdown-item text-decoration-none">
                      Asset Database
                    </NavLink>
                  </li>
                </ul>
              </li>
              {isAdmin &&
                <li className="nav-item dropdown">
                  <a href="#navbarDarkDropdownMenuLink" className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Panel
                  </a>
                  <ul className="dropdown-menu dropdown-submenu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                    <li>
                      <NavLink to="/admin/userlist" className="dropdown-item text-decoration-none">
                        Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/projectlist" className="dropdown-item text-decoration-none" onClick={alertMessage}>
                        Projects
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/deptlist" className="dropdown-item text-decoration-none" onClick={alertMessage}>
                        Departments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/supplier" className="dropdown-item text-decoration-none">
                        Vendors
                      </NavLink>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                      <a className="dropdown-item" href="#dropdownSubmenuLink">
                        Transfer &raquo;
                      </a>
                      <ul className="dropdown-menu dropdown-submenu dropdown-menu-dark">
                        <li>
                          <NavLink to="/admin/pendingActionList" className="dropdown-item">Asset Transfer Action</NavLink>
                        </li>
                        <li>
                          <NavLink to="/admin/assetLogList" className="dropdown-item">Asset Transfer Logs</NavLink>
                        </li>
                        <li>
                          <NavLink to="/admin/disposedAssetList" className="dropdown-item">Damaged/ E-Waste/ Asset Handover</NavLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              }
              <li className="nav-item">
                <NavLink to="/report" className="nav-link text-decoration-none">
                  Generate Report
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/sop" className="nav-link text-decoration-none">
                  ERP
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <div className="userName">
              <small>{user.fname} {user.lname}</small>
            </div>
            <div className="dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#navbarDropdownMenuAvatar"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={User}
                  className="rounded-circle"
                  height="30"
                  alt="Black and White Portrait of a Man"
                  loading="lazy"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <a className="dropdown-item" href="#dropdown-item" onClick={openModal}><i className="fa fa-user fa-xs" aria-hidden="true"></i>&nbsp;&nbsp;My profile</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#dropdown-item" onClick={openPasswordModal}><i className="fa fa-cog fa-xs" aria-hidden="true"></i>&nbsp;&nbsp;Change Password</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#dropdown-item" onClick={logout}>
                    <i className="fa fa-sign-out fa-xs" aria-hidden="true"></i>&nbsp;
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <ProfileModal isOpen={isOpen} closeModal={closeModal} user={user} />
      <ChangePasswordModal isPasswordChangeModal={isPasswordChangeModal} closePasswordModal={closePasswordModal} user={user}/>
    </div>
  );
};

export default Navbar;
