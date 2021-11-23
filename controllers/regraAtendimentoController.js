const fs = require('fs');
const MESSAGES = require('../utils/messages');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    index(req, res) {
        try {
            return res.status(200).send("Oi")
        } catch (error) {
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    create(req, res){
        try {
            const {atendimentoDiario, atendimentoSemanal, diaEspecifico} = req.body
            if(atendimentoDiario.intervalos) {
                fs.writeFile('./json/regraAtendimento.json', JSON.stringify({atendimentoDiario: atendimentoDiario}), (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).send()
                    }
                    return res.status(200).send('funcioniu')
                });
            }
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    horariosDisponiveis(req, res){
        try {
            
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }
}