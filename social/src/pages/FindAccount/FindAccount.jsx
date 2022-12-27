import React, { useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import ResetHeader from "../../components/ResetHeader/ResetHeader";
import userImg from "../../assets/images/user.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { hideMobileEmail } from "../../utility/helper.js";
import axios from "axios";
import createToast from "../../utility/toast";

const FindAccount = () => {
  const navigate = useNavigate();
  // find user data state
  const [findUser, setfindUser] = useState({
    name: "",
    email: "",
    mobile: "",
    photo: "",
  });

  //handle cancel
  const handleCancel = (e) => {
    e.preventDefault();
    Cookies.remove("findUser");
    navigate("/forgot-password");
  };

  // handle password reset link
  const handleResetLink = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/v1/user/send-password-reset-otp", {
        auth: findUser.mobile ?? findUser.email,
      })
      .then((res) => {
        createToast(res.data.message, "success");
        navigate("/activation/reset-pass");
      })
      .catch((error) => {
        createToast(error.response.data.message);
      });
  };

  useEffect(() => {
    // get all cookies data
    const userData = JSON.parse(Cookies.get("findUser")) ?? null;
    if (userData) {
      setfindUser({
        name: userData.name,
        email: userData.email ?? null,
        mobile: userData.mobile ?? null,
        photo: userData.photo,
      });
    }
  }, []);

  return (
    <>
      <ResetHeader />
      <div className="reset-area">
        <div className="reset-wraper">
          <div className="reset-box">
            <div className="reset-box-header">
              <span className="title">Reset your password</span>
            </div>
            <div className="reset-body">
              <div className="find-user-account">
                <img
                  src={
                    findUser.photo
                      ? findUser.photo
                      : "https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-placeholder-black-png-image_3918427.jpg"
                  }
                  alt=""
                />

                <span>{findUser.name}</span>
                {findUser.email && (
                  <p>Email : {hideMobileEmail(findUser.email)}</p>
                )}
                {findUser.mobile && (
                  <p>Mobile : {hideMobileEmail(findUser.mobile)}</p>
                )}

                <p>To reset your account password, please continue</p>
              </div>
            </div>
            <div className="reset-footer">
              <a href="#"></a>
              <div className="reset-btns">
                <a onClick={handleCancel} className="cancel" href="#">
                  Not you ?
                </a>
                <a onClick={handleResetLink} className="continue" href="#">
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

export default FindAccount;
