import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import routers from './routers/index.mjs'
import middleware from './middleware/index.mjs'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200
}

// initial middlerware
app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// routers
app.use('/auth', routers.auth)
app.use('/api', routers.api)

// error middleware
app.use(middleware.genericError)

export default app