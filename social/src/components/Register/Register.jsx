import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import crossBtn from "../../assets/icons/cross.png";
import { userRegister } from "../../redux/auth/authAction.js";
import createToast from "../../utility/toast";

// date of reg
const day = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

// Month of reg
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// year of reg
const years = Array.from(
  { length: 80 },
  (_, i) => new Date().getFullYear() - i
);

const Register = ({ setRegister }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // current date info
  const date = new Date();

  // form fields
  const [input, setInput] = useState({
    fname: "",
    sname: "",
    emailOrMobile: "",
    password: "",
    day: date.getDate(),
    month: month[date.getMonth()],
    year: date.getFullYear(),
    gender: "",
  });

  // validate state
  const [validate, setValidate] = useState({
    fname: false,
    sname: false,
    emailOrMobile: false,
    password: false,
  });
  // input state update
  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle input validated
  const handleInputVadate = (e) => {
    const fieldName = e.target.name;
    if (!input[fieldName]) {
      setValidate((prevState) => ({
        ...prevState,
        [fieldName]: true,
      }));
    } else {
      setValidate((prevState) => ({
        ...prevState,
        [fieldName]: false,
      }));
    }
  };

  // handle variable on focus
  const handleInputVadateFocus = (e) => {
    const fieldName = e.target.name;
    setValidate((prevState) => ({
      ...prevState,
      [fieldName]: false,
    }));
  };

  // handle register
  const handleRegister = (e) => {
    e.preventDefault();

    // check validation
    if (
      !input.fname ||
      !input.sname ||
      !input.emailOrMobile ||
      !input.password ||
      !input.gender
    ) {
      createToast("All fields are required");
    } else {
      dispatch(
        userRegister(
          {
            first_name: input.fname,
            sur_name: input.sname,
            auth: input.emailOrMobile,
            password: input.password,
            gender: input.gender,
            birth_date: input.day,
            birth_month: input.month,
            birth_year: input.year,
          },
          setInput,
          e,
          setRegister,
          navigate
        )
      );
    }
  };

  return (
    <>
      <ReactTooltip data-offset="{'top': 10, 'left': 10,'font-size': 30}" />

      <div className="blur-box">
        <div className="sign-up-card">
          <div className="sign-up-header">
            <div className="sign-up-content">
              <span>Sign Up</span>
              <span>It's quick and easy.</span>
            </div>
            <button onClick={() => setRegister(false)}>
              <img src={crossBtn} alt="" />
            </button>
          </div>
          <div className="sign-up-body">
            <form onSubmit={handleRegister}>
              <div className="reg-form reg-form-inline">
                <input
                  className={validate.fname && "error-border"}
                  name="fname"
                  type="text"
                  value={input.fname}
                  onChange={handleInputChange}
                  placeholder="First Name "
                  onBlur={handleInputVadate}
                  onFocus={handleInputVadateFocus}
                />
                <input
                  className={validate.sname && "error-border"}
                  name="sname"
                  type="text"
                  onChange={handleInputChange}
                  value={input.sname}
                  placeholder="Surname"
                  onBlur={handleInputVadate}
                  onFocus={handleInputVadateFocus}
                />
              </div>
              <div className="reg-form">
                <input
                  className={validate.emailOrMobile && "error-border"}
                  name="emailOrMobile"
                  type="text"
                  onChange={handleInputChange}
                  value={input.emailOrMobile}
                  onBlur={handleInputVadate}
                  onFocus={handleInputVadateFocus}
                  placeholder="Mobile number or email address"
                />
              </div>
              <div className="reg-form">
                <input
                  className={validate.password && "error-border"}
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  value={input.password}
                  onBlur={handleInputVadate}
                  onFocus={handleInputVadateFocus}
                  placeholder="New password"
                />
              </div>
              <div className="reg-form">
                <span>Date of birth</span>
                <div className="reg-form-select">
                  <select name="day" id="" onChange={handleInputChange}>
                    {day.map((item, index) => (
                      <option
                        selected={item === input.day ? true : false}
                        value={item}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <select name="month" id="" onChange={handleInputChange}>
                    {month.map((item, index) => (
                      <option
                        selected={item === input.month ? true : false}
                        value={item}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <select name="year" id="" onChange={handleInputChange}>
                    {years.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="reg-form">
                <span>Gender</span>
                <div className="reg-form-select">
                  <label>
                    Female
                    <input
                      onChange={handleInputChange}
                      type="radio"
                      name="gender"
                      value="Female"
                    />
                  </label>
                  <label>
                    Male
                    <input
                      onChange={handleInputChange}
                      type="radio"
                      name="gender"
                      value="Male"
                    />
                  </label>
                  <label>
                    Custom
                    <input
                      onChange={handleInputChange}
                      type="radio"
                      name="gender"
                      value="Custom"
                    />
                  </label>
                </div>
              </div>

              <div className="reg-form">
                <p>
                  People who use our service may have uploaded your contact
                  information to Facebook. <a href="#">Learn more.</a>
                </p>
              </div>
              <div className="reg-form">
                <p>
                  By clicking Sign Up, you agree to our <a href="#">Terms</a>,
                  <a href="#">Privacy Policy</a> and
                  <a href="#">Cookies Policy</a>. You may receive SMS
                  notifications from us and can opt out at any time.
                </p>
              </div>

              <div className="reg-form">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
