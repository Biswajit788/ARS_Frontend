import React, { Component } from "react";
import Logo from '../assets/logo.jpg';
import '../index.css';
import { projects, departments} from './pages/data';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      uid: "",
      password: "",
      project: "",
      dept: "",
      role:"User",
      desgn:"",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { fname, lname, email, uid, password, project, dept, role, desgn } = this.state;
    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(`${apiUrl}/register`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        uid,
        password,
        project,
        dept,
        role,
        desgn,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("User created successfully");
          window.location.href = "/";
        }
        else if(data.status === "error"){
          alert("User Id already registered !!");
        }
        // console.log(data, "UserRegister");
      });
  }
  render() {
    return (
      
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form className="row" onSubmit={this.handleSubmit}>
            <div className="logo">
              <img src={Logo} alt="Neepco Ltd." width="80px" height="80px" />
              <h5>Sign Up</h5>
              <hr />
            </div>
            <div className="mb-3 col-md-6">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                onChange={(e) => this.setState({ fname: e.target.value })}
                required
              />
            </div>

            <div className="mb-3 col-md-6">
              <label>Last name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={(e) => this.setState({ lname: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Designation"
                onChange={(e) => this.setState({ desgn: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
                onChange={(e) => this.setState({ email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label>Place of Posting</label>
              <select
                className="form-select"
                onChange={(e) => this.setState({ project: e.target.value })}
                required
              >
                <option value="">Please select</option>
                {projects.map((project) =>
                    <option key={project} value={project}>{project}</option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label>Department</label>
              <select
                className="form-select"
                onChange={(e) => this.setState({ dept: e.target.value })}
                required
              >
                <option value="">Please Select</option>
                {departments.map((department) =>
                    <option key={department} value={department}>{department}</option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 4-digit Employee Code"
                maxLength={4}
                onChange={(e) => this.setState({ uid: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => this.setState({ password: e.target.value })}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p className="forgot-password text-right">
              Already registered <a href="/sign-in">sign in?</a>
            </p>
          </form>
        </div>
      </div >
    );
  }
}
