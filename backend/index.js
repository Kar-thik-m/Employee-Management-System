import express from "express";
import connectToDb from "./DataBase/DataBase.js";
import userRouter from "./Routes/UserRouter.js";
import TaskRouter from "./Routes/TaskRouter.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import cors from "cors"

const app = express();

connectToDb();
dotenv.config();


cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

app.use(express.json());

app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/task', TaskRouter);

app.get('/', (req, res) => {
    res.send("wellcome");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("server run successful");
})
