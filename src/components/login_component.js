import React, { Component } from "react";
import axios from "axios";
import Logo from '../assets/logo.jpg'; // Make sure the path to the logo is correct
import Swal from 'sweetalert2';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { uid, password } = this.state;

    //To be used for dynamic ip
    const apiUrl = process.env.REACT_APP_API_URL;

    axios.post(`${apiUrl}/login-user`, { uid, password })
      .then((response) => {
        const data = response.data;
        if (data.status === "invalid") {
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
            document.getElementById('errorMsg').innerHTML = "User does not exist";
          });
        } else if (data.status === "inactive") {
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
            document.getElementById('errorMsg').innerHTML = "User Locked. Contact Administrator";
          });
        } else if (data.status === "ok") {
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
            window.localStorage.setItem("authToken", data.tokenAssign);
            window.localStorage.setItem("ecode", data.uid);
            window.localStorage.setItem("fname", data.fname);
            window.localStorage.setItem("lname", data.lname);
            window.localStorage.setItem("desgn", data.desgn);
            window.localStorage.setItem("email", data.email);
            window.localStorage.setItem("roleAssign", data.role);
            window.localStorage.setItem("dept", data.dept);
            window.localStorage.setItem("project", data.project);
            window.localStorage.setItem("status", data.flag);

            window.location.href = "/homepage";
          });
        } else {
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
            document.getElementById('errorMsg').innerHTML = "Username or Password is incorrect";
          });
        }
      })
      .catch((error) => {
        console.error("There was an error logging in!", error);
      });
  }

  render() {
    return (
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
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
                  onChange={(e) => this.setState({ uid: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => this.setState({ password: e.target.value })}
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
                <a href="/sign-up">Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
