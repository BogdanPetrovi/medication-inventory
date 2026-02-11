import express from 'express'
import router from './routes/router.js'
import morgan from 'morgan'
import globalErrorHandler from './utils/globalErrorHandler.js'

const app = express()

app.use(morgan("dev"))
app.use(express.json())

app.use("/api", router)

app.use(globalErrorHandler)

export default app