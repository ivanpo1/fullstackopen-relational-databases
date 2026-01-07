import {Router} from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt";

const router = Router()

router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

router.post('/', async (req, res, next) => {
    try {
        const { username, name, password } = req.body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = await User.create({username, name, passwordHash})
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.put('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username
            }
        })

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: `User with username '${req.params.username}' does not exist`
            })
        }

        user.username = req.body.username
        await user.save()

    } catch (error) {
        next(error)
    }
})

export default router