import jwt from "jsonwebtoken";
import { SECRET } from "./config.js";
import { ActiveSession } from "../models/index.js"
import User from "../models/user.js";
import req from "express/lib/request.js";

const verifySession = async (sessionId) => {
  const session = await ActiveSession.findOne({ where: { sessionId }})
  if (!session.isActive) {
    const error = new Error('session expired')
    error.status = 401
    throw error
  }
  return session
}

const verifyUserNotDisabled = async (userId) => {
  const user = await User.findByPk(userId)
  if (user.disabled) {
    const error = new Error('user disabled')
    error.status = 401
    throw error
  }
  return user
}

export const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      await verifySession(req.decodedToken.sessionId)
      req.user = await verifyUserNotDisabled(req.decodedToken.id)
    } catch (error) {
      return res.status(error.status || 401).json({ error: error.message})
    }



  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

