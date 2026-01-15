import { Router } from 'express'
import {Blog, User} from '../models/index.js'
import {Op} from "sequelize";
import { tokenExtractor } from "../util/middleware.js";

const router = Router()

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async(req, res) => {
    const where = {}

    if (req.query.search) {
        const searchTerm = `%${req.query.search}%`

        where[Op.or] = [
            { title: {[Op.iLike]: searchTerm }},
            { author: {[Op.iLike]: searchTerm }}
        ]

    }
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId']},
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const { title, url, author, year } = req.body
        const user = await User.findByPk(req.decodedToken.id)
        console.log('user', user)
        const blog = await Blog.create({ title, url, author, year, userId: user.id })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.post('/testing', tokenExtractor, async (req, res, next) => {
    try {
        res.json(req.decodedToken)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
    try {
        if (!req.blog) { return res.status(404).json({ error: 'Blog not found'})}
        if (req.decodedToken.id === req.blog.userId) {
            await req.blog.destroy()
            res.status(204).end()
        } else {
            res.status(401).json({ error: 'only user who created the blog can delete it' })
        }
    } catch (error) {
        next(error)
    }
})

export default router