import express, {Request, Response} from 'express'
import routes from './api/routes'
import errorHandlerMiddleware from './middleware/errorHandler'

const app = express()
const port = 8087 


app.use(express.json())
app.use(errorHandlerMiddleware)
app.use('/api/v1', routes)


app.listen(port, () => {
    console.log(`Server listening on port... ${port}`)
})

