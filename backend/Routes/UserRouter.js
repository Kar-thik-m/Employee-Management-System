
import express from 'express';
import { usermodel } from '../Models/UserModels.js';
import bcrypt from "bcrypt"
import uploadFile from '../Middlewares/MulterAccess.js';
import getUrl from '../Utils/UrlGenerate.js';
import cloudinary from "cloudinary"
import { sendToken } from '../Utils/ResponseTokens.js';
import { authenticateToken } from '../Middlewares/Authentication.js';
const userRouter = express.Router();



userRouter.post('/register', uploadFile, async (req, res) => {
    try {
        const payload = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileurl = getUrl(file);
        const cloud = await cloudinary.v2.uploader.upload(fileurl.content);

        const userCheck = await usermodel.findOne({ email: payload.email });
        if (userCheck) {
            return res.status(409).json({ message: "User already exists" });
        }


        const hash = await bcrypt.hash(payload.password, 10);

        const userdata = new usermodel({
            ...payload,
            password: hash,
            userimage: { id: cloud.public_id, url: cloud.secure_url }
        });

        await userdata.save();

        sendToken(userdata, 201, res);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error registering user details' });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const existingUser = await usermodel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }


        sendToken(existingUser, 200, res);

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: "Error in logging in" });
    }
});

userRouter.get('/loaduser', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {

        const userProfile = await usermodel.findById(userId);


        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



userRouter.get('/profile/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {

        const userProfile = await usermodel.findById(userId);

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});






export default userRouter