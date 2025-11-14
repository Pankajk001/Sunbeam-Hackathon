import express from 'express';
import { changePassword, editProfile, loginUser, registerUser } from '../controller/userController.js';
const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.put('/editprofile', editProfile);
userRouter.put('/changepassword', changePassword);

export default userRouter;