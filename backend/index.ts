import express from "express"
import tournamentRoutes from "./routes/tournamentRoutes"
import { errorHandler } from "./middleware/errorHandler"
import bracketRoutes from "./routes/bracketRoutes"
import cors from "cors"

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

// Routes
app.use("/health-check", (req, res) => {
  res.status(200).json({ status: "OK" })
})
app.use("/api/tournaments", tournamentRoutes)
app.use("/api/brackets", bracketRoutes)

// Error Handler
app.use(errorHandler)

app
  .listen(PORT, () => {
    console.info(`Application running on port ${PORT}`)
  })
  .on("error", (error) => {
    throw new Error(error.message)
  })
