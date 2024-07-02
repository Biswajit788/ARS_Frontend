import React from "react";
import axios from "axios";
import Logo from '../assets/logo.jpg'; // Make sure the path to the logo is correct
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function Login() {
  
  const navigate = useNavigate();

  const [uid, setUid] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use HTTP URL for local development
    const apiUrl = process.env.REACT_APP_API_URL;

    axios.post(`${apiUrl}/login-user`, { uid, password })
      .then((response) => {

        const res = response.data;
        if (response.status === 200) {
          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          }).then(() => {
            window.localStorage.setItem("authToken", res.token);
            navigate("/homepage");
          });
        }
      })
      .catch((error) => {

        if (error.response) {
          const statusCode = error.response.status;
          let errorMessage = "Username or Password is incorrect";

          if (statusCode === 404) {
            errorMessage = "User does not exist";
          } else if (statusCode === 403) {
            errorMessage = "User Locked. Contact Administrator";
          }

          Swal.fire({
            title: 'Login Error',
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          }).then(() => {
            document.getElementById('errorMsg').innerHTML = errorMessage;
          });
        } else {
          console.error("There was an error logging in!", error);
          Swal.fire({
            title: 'Login Error',
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          }).then(() => {
            document.getElementById('errorMsg').innerHTML = "There was an error logging in. Please try again later.";
          });
        }
      });
  };

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <div className="logo">
              <img src={Logo} alt="Neepco Ltd." width="100px" height="100px" />
              <h5>ARS Login</h5>
              <hr />
            </div>
            <center><span className="text-danger" id="errorMsg"></span></center>
            <div className="mb-3 mt-2">
              <label>Username</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter 4-digit Ecode"
                onChange={(e) => setUid(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input ckbox"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              <a href="#">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
