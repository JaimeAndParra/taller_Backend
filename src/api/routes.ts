/* Permite orquestar las rutas de los diferentes componentes */

import Router from 'express'
import doctoresRoutes from './components/doctores/routes'
import citasRoutes from './components/citas/routes'
import pacientesRoutes from './components/pacientes/routes'


const router = Router();

router.use('/doctores', doctoresRoutes)
router.use('/citas', citasRoutes)
router.use('/pacientes', pacientesRoutes)

export default router

