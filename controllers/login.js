import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { SECRET } from '../util/config.js'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { ActiveSession } from "../models/index.js";


const router = Router()

router.post('/', async (req, res) => {

    const {username, password} = req.body

    const user = await User.findOne({
        where: {
            username: username
        },
        attributes: { include: ['passwordHash']},
    })

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)
    await ActiveSession.create({ user_id: user.id })

    res.status(200).send({ token, username: user.username, name: user.name })
})

export default router