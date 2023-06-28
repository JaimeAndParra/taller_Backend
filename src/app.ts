/* Express permite configurar y levantar la aplicacion */
/* En el main no se debe poner nada de logica */

import express, {Request, Response} from 'express'
import logger from './utils/logger'
import routes from './api/routes'

const app = express()
const port = 8087 

// Convierte los body de los request en json
app.use(express.json())

app.use('/api/v1', routes)

app.listen(port, () => {
    logger.info('')
    console.log(`Server listening on port... ${port}`)
})

