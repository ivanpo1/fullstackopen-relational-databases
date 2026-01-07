import { Router } from 'express'
import {Blog} from '../models/index.js'

const router = Router()

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res, next) => {
    try {
        const { title, url, author } = req.body
        const blog = await Blog.create({ title, url, author })
        res.json(blog)
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

router.delete('/:id', blogFinder, async (req, res, next) => {
    try {
        if (!req.blog) { return res.status(404).json({ error: 'Blog not found'})}
        await req.blog.destroy()
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

export default router