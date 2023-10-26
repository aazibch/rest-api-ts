import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../models/User';
import { ObjectId } from 'mongoose';

interface CustomRequest extends express.Request {
  identity?: Record<string, any>;
}

export const isOwner = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId: ObjectId = req.identity._id;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies['REST-AUTH'];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    req.identity = existingUser;

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
