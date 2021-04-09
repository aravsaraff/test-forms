import React, { Component } from "react";
import Axios from "axios";
import { Pane, TextInputField, Button, Heading, toaster } from "evergreen-ui";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.scss";

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

const recaptchaRef = React.createRef();

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmed: "",
      phone: "",
    };
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let {
        firstName,
        lastName,
        email,
        password,
        passwordConfirmed,
        phone,
      } = this.state;
      firstName = firstName.trim();
      lastName = lastName.trim();
      email = email.trim();
      password = password.trim();
      passwordConfirmed = passwordConfirmed.trim();
      phone = phone.trim();
      const token = await recaptchaRef.current.executeAsync();
      if (password !== passwordConfirmed) {
        // Passwords don't match!
        console.log("Passwords don't match.");
        toaster.warning("Passwords don't match!");
      }
      if (password.length < 8) {
        toaster.warning("Minimum Length Of Passowrd should be 8 characters");
      } else {
        let resp = await Axios.post("/register", {
          name: firstName + " " + lastName,
          email: email,
          password: password,
          phone: phone,
          token: token,
        });
        console.log(resp);
        await setTimeout(() => {
          toaster.notify("Registered Successfully");
        }, 2000);
        if (resp.status == 200) {
          window.location.href = "/login?status=false";
        } else {
          console.log("error Registering");
          toaster.warning("Something went wrong, please try again later!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="register-container">
        <Pane className="register-pane" elevation={1}>
          <form onSubmit={this.handleSubmit}>
            <Heading size={700} margin="default">
              Register
            </Heading>
            <TextInputField
              required
              name="first_name"
              label="First Name"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) => this.setState({ firstName: e.target.value })}
              value={this.state.firstName}
            />

            <TextInputField
              required
              name="last_name"
              label="Last Name"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) => this.setState({ lastName: e.target.value })}
              value={this.state.lastName}
            />

            <TextInputField
              required
              name="email"
              label="Email"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) => this.setState({ email: e.target.value })}
              value={this.state.email}
            />

            <TextInputField
              required
              type="password"
              name="password"
              label="Password"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) => this.setState({ password: e.target.value })}
              value={this.state.password}
            />

            <TextInputField
              required
              type="password"
              name="password_confirmation"
              label="Confirm Password"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) =>
                this.setState({ passwordConfirmed: e.target.value })
              }
              value={this.state.passwordConfirmed}
            />

            <TextInputField
              required
              type="tel"
              name="phone"
              label="Mobile Number"
              inputHeight={30}
              inputWidth={250}
              onChange={(e) => this.setState({ phone: e.target.value })}
              value={this.state.phone}
            />

            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey="6LfnPuEZAAAAANbADW2JK_7hw2i3cY8Op0sKvudN"
            />

            <Button type="submit" appearance="primary">
              Sign Up
            </Button>
          </form>
        </Pane>
      </div>
    );
  }
}
