const {Router} = require('express')
const regraAtendimentoController = require('../controllers/regraAtendimentoController')
const router = Router()

router.post('/listar', regraAtendimentoController.horariosDisponiveis)

module.exports = router