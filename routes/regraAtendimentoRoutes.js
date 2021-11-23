const {Router} = require('express')
const regraAtendimentoController = require('../controllers/regraAtendimentoController')
const router = Router()

router.get('/', regraAtendimentoController.index)
router.post('/', regraAtendimentoController.create)

module.exports = router