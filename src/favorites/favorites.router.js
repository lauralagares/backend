import express from 'express';
import {getAllFavorites, addFavorites, deleteFavorites} from './favorites.controller.js';

const router = express.Router();

router.route('/')
    .get(getAllFavorites) 
    .post(addFavorites) 
    .delete(deleteFavorites);

export default router;