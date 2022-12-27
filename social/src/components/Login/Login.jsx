import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/auth/authAction";
import createToast from "../../utility/toast";

const Login = ({ setRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    auth: "",
    password: "",
  });

  // handle input change
  const handleInputChange = (e) => {
    setInput((preState) => ({
      ...preState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle ser login
  const handleUserLogin = (e) => {
    e.preventDefault();

    if (!input.auth || !input.password) {
      createToast("All fields are required");
    } else {
      dispatch(
        userLogin({ auth: input.auth, password: input.password }, navigate)
      );
    }
  };

  return (
    <>
      <div className="auth-box">
        <form onSubmit={handleUserLogin}>
          <div className="auth-form">
            <input
              name="auth"
              onChange={handleInputChange}
              type="text"
              value={input.auh}
              placeholder="Email address or phone number"
            />
          </div>
          <div className="auth-form">
            <input
              name="password"
              onChange={handleInputChange}
              type="password"
              value={input.password}
              placeholder="Password"
            />
          </div>
          <div className="auth-form">
            <button type="submit">Log In</button>
          </div>
        </form>

        <Link to={"/forgot-password"}>Forgotten password?</Link>

        <div className="divider"></div>

        <button onClick={() => setRegister(true)}>Create New Account</button>
      </div>
    </>
  );
};

export default Login;
