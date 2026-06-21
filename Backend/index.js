import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utilis/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import serviceRoute from "./routes/service.route.js";
import requestRoute from "./routes/request.route.js";
import reviewRoute from "./routes/review.route.js";
import profileRoute from "./routes/profile.route.js";


const app = express();

// Middleware

app.use(express.json());
app.use(cors({
  origin: "https://teyzix-market.vercel.app",// ← Vercel URL 
  credentials: true,
}));

app.use(cookieParser());
//Api's
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/services",serviceRoute);
app.use("/api/requests",requestRoute);
app.use("/api/reviews",reviewRoute);
app.use("/api/profiles",profileRoute);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
};

startServer();