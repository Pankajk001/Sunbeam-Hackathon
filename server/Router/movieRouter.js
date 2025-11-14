import express from 'express';
import { getMovies , createReview, editReview, deleteReview, getAllReviews} from '../controller/moviesController.js';

const movieRouter = express.Router();

movieRouter.get('/getAllMovies', getMovies);
movieRouter.post('/createReview', createReview);
movieRouter.put('/editReview/:id', editReview);
movieRouter.delete('/deleteReview/:id', deleteReview);
movieRouter.get('/getAllReviews', getAllReviews);

export default movieRouter;