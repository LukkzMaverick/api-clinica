const fs = require('fs');
const MESSAGES = require('../utils/messages');
const { v4: uuidv4 } = require('uuid');
const arquivoRegraAtendimento = './json/regraAtendimento.json'
module.exports = {

    async index(req, res) {
        try {
            let response;
            try {
                response = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'));
            } catch (error) {
                return res.status(404).send({ errors: [{ msg: MESSAGES.JSON_VAZIO_REGRA_ATENDIMENTO }] })
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    create(req, res) {
        try {
            const { atendimentoDiario, atendimentoSemanal, diaEspecifico } = req.body
            if (atendimentoDiario.intervalos) {
                fs.writeFile(arquivoRegraAtendimento, JSON.stringify({ atendimentoDiario: atendimentoDiario }), (err) => {
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

    delete(req, res){
        try {
            const objRegraAtendimento = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'));
            const {id} = req.params
            let removido = false 
            objRegraAtendimento.atendimentoDiario.forEach((regraAtendimento, index) => { 
                if(regraAtendimento.id === id) {
                    objRegraAtendimento.splice(index, 1)
                    removido = true
                    break
                }
            })
            if(removido){
                
            }
            Object.keys(objRegraAtendimento.atendimentoSemanal).forEach((dia) => {
                dia.forEach((regraAtendimento, index) => { 
                    if(regraAtendimento.id === id) {
                        objRegraAtendimento.splice(index, 1)
                        removido = true
                    }
                })
            })
            if(removido){
                
            }
            Object.keys(objRegraAtendimento.atendimentoDiaEspecifico).forEach((dia) => {
                dia.forEach((regraAtendimento, index) => { 
                    if(regraAtendimento.id === id) {
                        objRegraAtendimento.splice(index, 1)
                        removido = true
                        break
                    }
                })
            })
            if(removido){
                
            }
            
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    horariosDisponiveis(req, res) {
        try {

        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }
}