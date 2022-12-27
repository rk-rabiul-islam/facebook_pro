import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import FacebookLogo from "../../assets/icons/facebook.svg";
import Footer from "../../components/Footer/Footer";
import Cookie from "js-cookie";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  activationByOTP,
  checkPasswordResetCode,
  resentLink,
} from "../../redux/auth/authAction";
import createToast from "../../utility/toast";
import ResetHeader from "../../components/ResetHeader/ResetHeader";

const Activation = () => {
  const { type } = useParams();

  // dispatch
  const dispatch = useDispatch();

  // code statet
  const [code, setCode] = useState("");

  // code update
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // handle code containew
  const handleCodeContinue = (e) => {
    e.preventDefault();
    if (!code) {
      createToast("Please set OTP code", "warn");
    } else {
      dispatch(
        activationByOTP(
          {
            code: code,
            email: Cookie.get("otp"),
          },
          navigate
        )
      );
    }
  };
  // navigate
  const navigate = useNavigate();
  // activation Email
  const activationEmail = Cookie.get("otp");

  // handle activation cancel
  const handleActivationCancel = (e) => {
    e.preventDefault();
    Cookie.remove("otp");
    navigate("/login");
  };

  // resend activation link
  const handleResendLink = (e) => {
    e.preventDefault();

    dispatch(resentLink(activationEmail, navigate));
  };

  // handle password reset
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!code) {
      createToast("Otp code is required", "warn");
    } else {
      dispatch(
        checkPasswordResetCode(
          {
            code: code,
            auth: Cookie.get("otp"),
          },
          navigate
        )
      );
    }
  };

  useEffect(() => {
    if (!activationEmail) {
      navigate("/login");
    }
  });

  return (
    <>
      <ResetHeader />
      <div className="reset-header">
        <div className="reset-header-wraper">
          <div className="reset-logo">
            <img src={FacebookLogo} alt="" />
          </div>
          <div className="login-part">
            <input type="text" placeholder="Email or mobile number" />
            <input type="text" placeholder="Password" />
            <button>Log In</button>
            <a href="#">Forgotten account?</a>
          </div>
        </div>
      </div>

      <div className="reset-area">
        <div className="reset-wraper">
          <div className="reset-box">
            <div className="reset-box-header">
              <span className="title">Enter security code</span>
            </div>
            <div className="reset-body">
              <p>
                Please check your emails for a message with your code. Your code
                is 5 numbers long.
              </p>
              <div className="code-box">
                <input type="text" value={code} onChange={handleCodeChange} />
                <div className="code-text">
                  <span>We sent your code to:</span>
                  <span>{activationEmail}</span>
                </div>
              </div>
            </div>
            <div className="reset-footer">
              <a onClick={handleResendLink} href="#">
                Didn't get a code?
              </a>
              <div className="reset-btns">
                <a onClick={handleActivationCancel} className="cancel" href="#">
                  Cancel
                </a>
                <a
                  onClick={
                    type == "account" ? handleCodeContinue : handlePasswordReset
                  }
                  className="continue"
                  href="#"
                >
                  Continue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Activation;
