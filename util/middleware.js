import jwt from "jsonwebtoken";
import { SECRET } from "./config.js";
import { ActiveSession } from "../models/index.js"
import User from "../models/user.js";

const verifySession = async (sessionId) => {
  const session = await ActiveSession.findOne({ where: { sessionId: sessionId }})
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

export const errorMiddleware = (error, req, res, next) => {
  console.error('error.message', error.message)
  console.log('error', error)

  if (error.name === 'SequelizeValidationError') {
    const message = error.errors.map(error => {
      const field = error.path.split('.')

      let message = error.message
      if (error.message.includes('cannot be null')) {
        message = `${field} cannot be empty`
      }

      if (error.message.includes('Validation isEmail on username failed')) {
        message = `Username must be a valid Email address`
      }

      return message
    })

    return res.status(400).json({
        error: 'Validation Failure',
        message: message
      }
    )
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(error => {
      return error.message
    })

    return res.status(400).json({
      error: errors
    })
  }

  res.status(500).json({
    error: error.message
  })
}

