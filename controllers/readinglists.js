import { Router } from 'express'
import { ReadingList, User } from "../models/index.js";
import { tokenExtractor } from "../util/middleware.js";
const router = Router()


router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body
    const readingListItem = await ReadingList.create({ userId, blogId })
    res.json(readingListItem)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async(req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if (req.decodedToken.id !== readingList.userId) {
      return res.status(401).json({ error: 'user is not the owner of reading list' })
    }

    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})


export default router