import express from 'express';
import 'dotenv/config';
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import authorsRouter from './controllers/authors.js'
import logoutRouter from './controllers/logout.js'
import readingListsRouter from './controllers/readinglists.js'
import { PORT } from './util/config.js'
import { connectToDatabase } from "./util/db.js";
import { errorMiddleware } from "./util/middleware.js";

const app = express();

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/readinglists', readingListsRouter)

app.use(errorMiddleware)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
  })
}

start()