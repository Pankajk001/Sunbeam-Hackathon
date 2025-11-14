import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import userRouter from './Router/userRouter.js';
import movieRouter from './Router/movieRouter.js';
import { myAuth } from './Auth/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(myAuth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
