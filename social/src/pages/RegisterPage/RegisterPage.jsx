import React from "react";
import Footer from "../../components/Footer/Footer";
import FacebookLogo from "../../assets/icons/facebook.svg";
import Register from "../../components/Register/Register";

const RegisterPage = () => {
  return (
    <>
      <div className="fb-auth">
        <div style={{ width: "auto" }} className="auth-wraper">
          <div className="auth-right">
            <img src={FacebookLogo} alt="" />
            <Register />
            <p>
              <a href="#">Create a Page</a> for a celebrity, brand or business.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;
