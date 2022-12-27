import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import mongoDBConnect from "./config/db.js";
import errorHandler from "./middlewares/errorHandeler.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";

// init express
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// init env variable
const PORT = process.env.PORT || 8080;

// Api route
app.use("/api/v1/user", userRoute);

// Express error handeler
app.use(errorHandler);

//listen server
mongoDBConnect();
app.listen(PORT, () => {
  //Mongodb Connection

  console.log(`server is running on port ${PORT}`.bgCyan.black);
});
