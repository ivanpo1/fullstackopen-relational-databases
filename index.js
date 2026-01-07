import express from 'express';
import 'dotenv/config';
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import { PORT } from './util/config.js'
import {connectToDatabase} from "./util/db.js";

const app = express();

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const errorMiddleware = (error, req, res, next) => {
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

app.use(errorMiddleware)


const start = async () => {
    await connectToDatabase()
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
}

start()