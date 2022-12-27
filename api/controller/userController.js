import User from "../models/User.js";
import createError from "../utility/createError.js";
import { hashPassword, passwordVerify } from "../utility/hash.js";
import { getRandom } from "../utility/math.js";
import { sendActivationLink, sendPasswordForgotLink } from "../utility/sendMail.js";
import { sendOTP } from "../utility/sendSMS.js";
import { createToken, tokenVerify } from "../utility/token.js";
import { isEmail, isMobile } from "../utility/validator.js";






/**f
 * @access public
 * @route /api/user/register
 * @method POST
 */
export const register = async (req, res, next) => {

  try {

    //get form data
    const { first_name, sur_name, auth, password, birth_date, birth_month, birth_year, gender } = req.body;

    //validation
    if (!first_name || !sur_name || !auth || !password || !gender) {
      next(createError(400, "All fields are required"));
    }

    // initial auth value
    let mobileData = null;
    let emailData = null;


    if (isEmail(auth)) {
      emailData = auth;
      const emailCheck = await User.findOne({ email: auth });
      if (emailCheck) {
        return next(createError(400, "Email already exits"));
      }

    } else if (isMobile(auth)) {
      mobileData = auth;
      const mobileCheck = await User.findOne({ mobile: auth });
      if (mobileCheck) {
        return next(createError(400, "Mobile already exits"));
      }
    } else {
      return next(createError(400, "Invalid mobile or Email"));
    }

    // create access token
    const activationCode = getRandom(10000, 99999);

    // cheack activation code
    const checkCode = await User.findOne({ access_token: activationCode });

    if (checkCode) {
      activationCode = getRandom(10000, 99999);
    }

    //create user
    const user = await User.create({
      first_name,
      sur_name,
      mobile: mobileData,
      email: emailData,
      password: hashPassword(password),
      birth_date,
      birth_month,
      birth_year,
      gender,
      access_token: activationCode
    });



    if (user) {

      if (emailData) {
        // create activation token
        const activationToken = createToken({ id: user._id }, '30d');

        // send activation mail
        sendActivationLink(user.email, {
          name: user.first_name + '' + user.sur_name,
          link: `${process.env.APP_URL + ':' + process.env.PORT}/api/v1/user/activate/${activationToken}`,
          code: activationCode
        });

        // send respose
        res.status(200).cookie('otp', user.email, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
          message: "User create successful",
          user: user
        });
      }

      if (mobileData) {
        //send activation OTP
        sendOTP(user.mobile, `Hi ${user.first_name} ${user.sur_name}, Your account activation OTP is ${activationCode}`);

        // send respose
        res.status(200).cookie('otp', user.mobile, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
          message: "User create successful",
          user: user
        });
      }


    }

    res.send('data send ok');

  } catch (error) {
    next(error);
  }

}

/**
 * @access public
 * @route /api/user/resend-activation
 * @method POST
 */
export const resendActivation = async (req, res, next) => {
  const { auth } = req.body;

  try {

    // initial auth value
    let mobileData = null;
    let emailData = null;
    let mobileCheck;
    let emailCheck;


    if (isEmail(auth)) {
      emailData = auth;
      emailCheck = await User.findOne({ email: auth });
      if (!emailCheck) {
        return next(createError(400, "Email User account not found"));
      }

      if (emailCheck.isActivate) {
        return next(createError(400, "Email User account not found"));
      }

    } else if (isMobile(auth)) {
      mobileData = auth;
      mobileCheck = await User.findOne({ mobile: auth });
      if (!mobileCheck) {
        return next(createError(400, "Mobile user account not found"));
      }

      if (mobileCheck.isActivate) {
        return next(createError(400, "Mobile User account not found"));
      }

    } else {
      return next(createError(400, "Invalid mobile or Email"));
    }

    // create access token
    const activationCode = getRandom(10000, 99999);

    // cheack activation code
    const checkCode = await User.findOne({ access_token: activationCode });

    if (checkCode) {
      activationCode = getRandom(10000, 99999);
    }

    if (mobileData) {
      //send activation OTP
      sendOTP(mobileCheck.mobile, `Hi ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your account activation OTP is ${activationCode}`);

      // Update new code
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activationCode,
      })

      // send respose
      res.status(200).cookie('otp', mobileCheck.mobile, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
        message: "New OTP send successful",

      });
    }




    if (emailData) {
      // create activation token
      const activationToken = createToken({ id: emailCheck._id }, '30d');

      // send activation mail
      sendActivationLink(emailCheck.email, {
        name: emailCheck.first_name + '' + emailCheck.sur_name,
        link: `${process.env.APP_URL + ':' + process.env.PORT}/api/v1/user/activate/${activationToken}`,
        code: activationCode
      });


      // Update new code
      await User.findByIdAndUpdate(emailCheck._id, {
        access_token: activationCode,
      })

      // send respose
      res.status(200).cookie('otp', emailCheck.email, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
        message: "Activation link send",
      });
    }

  } catch (error) {
    next(error);
  }

};

/**
* @access public
* @route /api/user/login
* @method POST
*/
export const login = async (req, res, next) => {

  try {
    const { auth, password } = req.body;

    if (isEmail(auth)) {
      // check email user
      const emailCheck = await User.findOne({ email: auth });
      if (!emailCheck) {
        return next(createError(400, "Email user not found"));
      } else {

        // check password
        const userPass = passwordVerify(password, emailCheck.password);

        if (!userPass) {
          return next(createError(400, "Password not match"));
        }

        if (userPass) {
          const token = createToken({ id: emailCheck._id }, '365d');
          return res.status(200).cookie('authToken', token).json({
            message: "User create successful",
            user: emailCheck,
            token: token
          });
        }


      }


    } else if (isMobile(auth)) {
      const mobileCheck = await User.findOne({ mobile: auth });
      if (!mobileCheck) {
        return next(createError(400, "Mobile user not found"));
      } else {
        // password check
        const userPass = passwordVerify(password, mobileCheck.password);
        if (!userPass) {
          return next(createError(400, "Password not match"));
        }

        if (userPass) {
          const token = createToken({ id: mobileCheck._id }, '365d');
          return res.status(200).cookie('authToken', token).json({
            message: "User Login successful",
            user: mobileCheck,
            token: token
          });
        }
      }
    } else {
      return next(createError(400, "Invalid mobile or Email"));
    }


    ////////////////////
    const loginUser = await User.findOne({ email: auth });

    if (!loginUser) {
      return next(createError(400, "Login user not found !"));
    } else {

      if (!passwordVerify(password, loginUser.password)) {
        return next(createError(400, "Worng password !"));
      } else {

        const token = createToken({ id: loginUser._id }, '365d');

        res.status(200).cookie('authToken', token).json({
          message: "User create successful",
          user: loginUser,
          token: token
        });
      }

    }



  } catch (error) {
    next(error);
  }

}


/**
* @access public
* @route /api/user/loggedInUser
* @method Get
*/
export const loggedInUser = async (req, res, next) => {

  try {
    const auth_token = req.headers.authorization;

    if (!auth_token) {
      return next(createError(400, "Token not found"));
    }

    if (auth_token) {
      const token = auth_token.split(' ')[1];
      const user = tokenVerify(token);

      if (!user) {
        return next(createError(400, "Invalid token "));
      }

      if (user) {
        const loggedInUser = await User.findById(user.id);
        if (!loggedInUser) {
          return next(createError(400, "User data not match  "));
        } else {
          res.status(200).json({
            message: "User data stable",
            user: loggedInUser
          });
        }
      }

    }
  } catch (error) {
    next(error);
  }

}


/**
 * Account activation by Email
 */
export const activateAccount = async (req, res, next) => {

  try {
    // get token
    const { token } = req.params;

    if (!token) {
      next(createError(400, "Invalid activation url"));
    } else {
      // verify token
      const tokenData = tokenVerify(token);

      // check token
      if (!tokenData) {
        next(createError(400, "Invalid token"));
      }


      // now activate account 

      if (tokenData) {

        const account = await User.findById(tokenData.id);

        if (account.isActivate == true) {
          next(createError(400, "Account already activate"));
        } else {
          await User.findByIdAndUpdate(tokenData.id, {
            isActivate: true,
            access_token: ''
          });
          res.status(200).json({
            message: "Account activate successful"
          });

        }
      }

    }

  } catch (error) {
    next(error);
  }

}


/**
 * Account activate by code
 */
export const activateAccountByCode = async (req, res, next) => {

  try {
    const { code, email } = req.body;
    const user = await User.findOne().or([{ email: email }, { mobile: email }]);

    if (!user) {
      next(createError(404, "Activation user not found"));
    } else {
      if (user.isActivate == true) {
        next(createError(404, "User account alerady activate"));
      } else {
        if (user.access_token != code) {
          next(createError(404, "Otp code not match"));
        } else {
          await User.findByIdAndUpdate(user._id, {
            isActivate: true,
            access_token: ""
          })
          res.status(200).json({
            message: "User account activate successful"
          })
        }
      }
    }

  } catch (error) {
    next(error);

  }
}

/**
 * forgot password
 */
export const forgotPassword = async (req, res, next) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      next(createError(404, "User not found"));
    }

    if (user) {

      // create activation token
      const passwordResetToken = createToken({ id: user._id }, '30m');


      // create access token
      const activationCode = getRandom(10000, 99999);

      // cheack activation code
      const checkCode = await User.findOne({ access_token: activationCode });

      if (checkCode) {
        activationCode = getRandom(10000, 99999);
      }

      // send activation mail
      sendPasswordForgotLink(user.email, {
        name: user.first_name + '' + user.sur_name,
        link: `${process.env.APP_URL + ':' + process.env.PORT}/api/v1/user/forgot-password/${passwordResetToken}`,
        code: activationCode
      });

      await User.findByIdAndUpdate(user._id, {
        access_token: activationCode
      })

      // send respose
      res.status(200).json({
        message: "A Password reset link has sent to your email",
      });

    }

  } catch (error) {
    next(error);
  }
}


/**
 * Account activation by Email
 */
export const passwordResetAction = async (req, res, next) => {

  try {
    // get token
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      next(createError(400, "Invalid password reset url"));
    } else {
      // verify token
      const tokenData = tokenVerify(token);

      // check token
      if (!tokenData) {
        next(createError(400, "Invalid token"));
      }


      // now activate account 

      if (tokenData) {

        const user = await User.findById(tokenData.id);

        if (!user) {
          next(createError(400, "Invalid User Id"));
        }

        if (user) {
          await User.findByIdAndUpdate(user._id, {
            password: hashPassword(password),
            access_token: ""
          });
          res.status(200).json({
            message: "Password Changed"
          });
        }

      }

    }

  } catch (error) {
    next(error);
  }

}


/**
 * Find user account for password reset
 */

export const findUserAccount = async (req, res, next) => {
  const { auth } = req.body;
  try {

    // initial auth value
    let mobileData = null;
    let emailData = null;

    if (isEmail(auth)) {
      emailData = auth;
      const emailCheck = await User.findOne({ email: auth });
      if (!emailCheck) {
        return next(createError(400, "Email user not found"));
      } else {
        res.status(200).cookie("findUser", JSON.stringify({
          name: emailCheck.first_name + "" + emailCheck.sur_name,
          photo: emailCheck.profile_photo,
          email: emailCheck.email,
        }), {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        }).json({
          user: emailCheck,
        });
      }

    } else if (isMobile(auth)) {
      mobileData = auth;
      const mobileCheck = await User.findOne({ mobile: auth });
      if (!mobileCheck) {
        return next(createError(400, "Mobile user not found"));
      } else {
        res.status(200).cookie("findUser", JSON.stringify({
          name: mobileCheck.first_name + " " + mobileCheck.sur_name,
          photo: mobileCheck.profile_photo,
          mobile: mobileCheck.mobile,
        }), {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        }).json({
          user: mobileCheck,
        });
      }
    } else {
      return next(createError(400, "Invalid mobile or Email"));
    }


  } catch (error) {
    next(error);
  }
}





/**
 * send password reset otp / link
 */
export const setPasswordResetOTP = async (req, res, next) => {
  const { auth } = req.body;

  try {

    // initial auth value
    let mobileData = null;
    let emailData = null;
    let mobileCheck;
    let emailCheck;


    if (isEmail(auth)) {
      emailData = auth;
      emailCheck = await User.findOne({ email: auth });
    } else if (isMobile(auth)) {
      mobileData = auth;
      mobileCheck = await User.findOne({ mobile: auth });
    } else {
      next(createError(400, "Invalid mobile or Email"));
    }

    // create access token
    const activationCode = getRandom(10000, 99999);

    // cheack activation code
    const checkCode = await User.findOne({ access_token: activationCode });

    if (checkCode) {
      activationCode = getRandom(10000, 99999);
    }

    if (mobileData) {
      //send activation OTP
      sendOTP(mobileCheck.mobile, `Hi ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your account activation OTP is ${activationCode}`);

      // Update new code
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activationCode,
      })

      // send respose
      res.status(200).cookie('otp', mobileCheck.mobile, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
        message: "New OTP send successful",

      });
    }

    if (emailData) {
      // create activation token
      const activationToken = createToken({ id: emailCheck._id }, '30d');

      // send activation mail
      sendActivationLink(emailCheck.email, {
        name: emailCheck.first_name + '' + emailCheck.sur_name,
        link: `${process.env.APP_URL + ':' + process.env.PORT}/api/v1/user/activate/${activationToken}`,
        code: activationCode
      });


      // Update new code
      await User.findByIdAndUpdate(emailCheck._id, {
        access_token: activationCode,
      })

      // send respose
      res.status(200).cookie('otp', emailCheck.email, { expires: new Date(Date.now() + 1000 * 60 + 15), }).json({
        message: "Activation link send",
      });
    }

  } catch (error) {
    next(error);
  }

}


/**
 * send password reset otp / link
 * post
 */
export const checkPasswordResetOTP = async (req, res, next) => {
  try {
    const { code, auth } = req.body;

    if (isEmail(auth)) {
      const userData = await User.findOne().where("email").equals(auth);

      if (!userData) {
        return next(createError(400, "invalid user request"));
      }

      if (userData) {

        if (userData.access_token != code) {
          return next(createError(400, "invalid OTP code"));
        }

        if (userData.access_token == code) {
          return res.cookie("cpid", userData._id.toString(), {
            expires: new Date(Date.now() + 1000 * 60 * 30),
          })
            .cookie("cpcode", code, {
              expires: new Date(Date.now() + 1000 * 60 * 30),
            })
            .status(200).json({
              message: "You can change your password"
            });
        }

      }
    } else if (isMobile(auth)) {
      const userData = await User.findOne().where("mobile").equals(auth);

      if (!userData) {
        return next(createError(400, "invalid user request"));
      }

      if (userData) {

        if (userData.access_token != code) {
          return next(createError(400, "invalid OTP code"));
        }

        if (userData.access_token == code) {
          return res.cookie("cpid", userData._id.toString(), {
            expires: new Date(Date.now() + 1000 * 60 * 30),
          })

            .cookie("cpcode", code, {
              expires: new Date(Date.now() + 1000 * 60 * 30),
            })
            .status(200).json({
              message: "You can change your password"
            });
        }

      }


    } else {
      return next(createError(400, "Invalid mobile or Email"));
    }

    if (!userData) {

    }

  } catch (error) {
    next(error);
  }
}

/**
 * password reset
 */
export const passwordReset = async (req, res, next) => {
  try {
    const { id, password, code } = req.body;
    const userData = await User.findOne().and([{ _id: id }, { access_token: code }]);

    if (!userData) {
      return next(createError(400, "Password change request faild"));
    }

    if (userData) {
      await User.findByIdAndUpdate(id, {
        password: hashPassword(password),
        access_token: null,
      });
      return res.clearCookie("cpcode").clearCookie("cpid").clearCookie("otp").clearCookie("findUser").status(200).json({
        message: "Password change successful",
      });
    }

  } catch (error) {
    next(error);
  }
}
