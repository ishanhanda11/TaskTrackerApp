const express = require('express')
const cors = require('cors')
const app = express()
const authRoutes = require('./routes/auth.routes')
const taskRoutes = require('./routes/task.routes')
app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
module.exports = app