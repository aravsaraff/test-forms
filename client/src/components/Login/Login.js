import React, { Component } from "react";
import {
  Pane,
  TextInputField,
  Button,
  Text,
  Link,
  toaster,
  Heading,
} from "evergreen-ui";
import "./Login.scss";
import Axios from "axios";

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  async componentDidMount() {
    if (
      new URLSearchParams(this.props.location.search).get("status") === "false"
    ) {
      toaster.warning("Please login first.");
    }
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password } = this.state;
      let user = await Axios.post("/login", {
        email: email,
        password: password,
      });
      console.log(user);
      if (user.status === 200) {
        console.log("Login success.");
        localStorage.setItem("isSignedIn", true);
        localStorage.setItem("nameState", user.data.name);
        window.location.href = "/";
      } else {
        toaster.warning("Wrong Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="login-container">
        <Pane className="login-pane" elevation={1}>
          <form onSubmit={this.handleSubmit}>
            <Heading size={700} margin="default">
              Login
            </Heading>
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
            <Button type="submit" appearance="primary">
              Login
            </Button>
            <Text
              marginTop={24}
              marginBottom={8}
              display="block"
              textAlign="center"
            >
              Forgot your password?{" "}
              <Link color="blue">Reset your password</Link>
            </Text>
          </form>
        </Pane>
      </div>
    );
  }
}
