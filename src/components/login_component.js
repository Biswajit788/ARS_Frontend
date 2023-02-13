import React, { Component } from "react";
import Logo from '../aasets/logo.jpg';
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

    fetch("http://10.3.0.57:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        uid,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data, "userRegister");

        if (data.status === "ok") {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            title: 'Login Successfull',
            icon: 'success'
          }).then(function(){
            window.localStorage.setItem("token", data.tokenAssign);
            window.location.href = "/dashboard";
          })
        }
        else {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            title: 'Login Error',
            icon: 'error'
          }).then(function(){
            document.getElementById('errorMsg').innerHTML = "Username or Password is incorrect";
          })
        }
      });
  }
  render() {
    return (
      <>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
              <div className="logo">
                <img src={Logo} alt="Neepco Ltd." width="100px" height="100px" />
                <h5>E-Procurement Data System</h5>
                <hr />
              </div>
              <span className="text-danger" id="errorMsg"></span>
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
      </>
    );
  }
}
