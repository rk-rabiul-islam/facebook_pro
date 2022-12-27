import { combineReducers } from "redux";
import AuthReducer from "../redux/auth/AuthReducer.js";
import loaderReducers from "./top-loader/loaderReducer.js";


//create root reducer
const rootReducer = combineReducers({
    auth: AuthReducer,
    loader: loaderReducers
});



// export default
export default rootReducer;