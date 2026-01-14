import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt";
import { Blog, ReadingList } from "../models/index.js";
import { Op } from "sequelize";

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res, next) => {

  try {
    const where = {}

    if (req.query.read) {
      console.log('query.read', req.query.read)
      where.read = req.query.read === 'true'
    }

    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'id']
      },
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
          through: {
            model: ReadingList,
            attributes: { exclude: ['userId', 'blogId'] },
            where
          },
        }
      ],
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ username, name, passwordHash })

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt
    })

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
        message: `User with username '${ req.params.username }' does not exist`
      })
    }

    user.username = req.body.username
    await user.save()

  } catch (error) {
    next(error)
  }
})

export default router