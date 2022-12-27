import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Activation from './pages/Activation/Activation';
import Forgot from './pages/Forgot/Forgot';
import FindAccount from './pages/FindAccount/FindAccount';
import Password from './pages/Password/Password';
import ReactTooltip from 'react-tooltip';
import LoadingBar from "react-top-loading-bar";
import { useDispatch, useSelector } from 'react-redux';
import { LOADER_END } from './redux/top-loader/loaderTypes';
import AuthReject from './PrivateRoute/AuthReject';
import { useEffect } from 'react';
import { tokenUser } from './redux/auth/authAction';
import AuthRedirect from './PrivateRoute/AuthRedirect';
import Cookies from 'js-cookie';

import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
const token = Cookies.get("authToken");




function App() {
  const loader = useSelector((state) => state.loader);
  const loaderDispatch = useDispatch();
  const tokenDispatch = useDispatch();

  useEffect(() => {
    if (token) {
      tokenDispatch(tokenUser(token));
    }
  }, [token]);

  return (
    <>
      <LoadingBar color="#1877F2" progress={loader} onLoaderFinished={loaderDispatch({ type: LOADER_END })} />

      <ReactTooltip />

      <ToastContainer
        style={{ zIndex: 99999 }} position='top-center' autoClose='3000'
      />


      <Routes>
        <Route path='/activation/:type' element={<Activation />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/forgot-password' element={<Forgot />} />
        <Route path='/find-account' element={<FindAccount />} />
        <Route path='/change-password' element={<Password />} />
      </Routes>
    </>
  );
}

export default App;
