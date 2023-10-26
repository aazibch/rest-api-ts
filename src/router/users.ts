import express from 'express';

import { deleteUser, getAllUsers } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
};
