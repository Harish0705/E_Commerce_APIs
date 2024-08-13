import express from "express";
import "dotenv/config";
import "express-async-errors"; // handle errors
import cookieParser from "cookie-parser";
import { connectDB } from "./db/dbconnect.js";
import {
  notFound,
  errorHandlerMiddleware,
  authMiddleware,
} from "./middlewares/index.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database Connected");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error.message);
  }
};

start();
