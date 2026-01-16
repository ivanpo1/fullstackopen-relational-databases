import { Router } from 'express'
import { tokenExtractor } from "../util/middleware.js";
import { ActiveSession } from "../models/index.js";

const router = Router()

router.delete('/', tokenExtractor, async(req, res, next) => {
  const activeSession = await ActiveSession.findOne({ where: { user_id: req.user.id, session_id: req.decodedToken.sessionId }})
  activeSession.isActive = false
  await activeSession.save()
  res.status(204).end()
})

export default router