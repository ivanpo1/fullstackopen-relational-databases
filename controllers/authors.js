import { Router } from 'express'
import {Blog} from "../models/index.js";
import {sequelize} from "../util/db.js";
const router = Router()

router.get('/', async (req, res, next) => {
    const blogs = await Blog.findAll({
        group: 'author',
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})

export default router