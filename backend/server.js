// backend/server.js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err))

const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')
const profileRoutes = require('./routes/profileRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
