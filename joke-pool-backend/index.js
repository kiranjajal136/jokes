import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import jokesRoutes from './routes/jokes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.use('/api/jokes', jokesRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

