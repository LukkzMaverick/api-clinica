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
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async delete(req, res){
        try {
            const objRegraAtendimento = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'));
            const {id} = req.params
            let removido = objRegraAtendimento.atendimentoDiario.find((regraAtendimento, index) => {
                if(regraAtendimento.id === id) {
                    objRegraAtendimento.atendimentoDiario.splice(index, 1)
                    return true
                }else{
                    return false
                }
            })
            if(removido){
                
            }
            Object.keys(objRegraAtendimento.atendimentoSemanal).forEach((dia) => {
                objRegraAtendimento.atendimentoSemanal[dia].forEach((regraAtendimento, index) => { 
                    if(regraAtendimento.id === id) {
                        objRegraAtendimento.atendimentoSemanal[dia].splice(index, 1)
                        removido = true
                    }
                })
            })
            if(removido){
                
            }
            removido = Object.keys(objRegraAtendimento.atendimentoDiaEspecifico).find((dia) => 
            objRegraAtendimento.atendimentoDiaEspecifico[dia].forEach((regraAtendimento, index) => { 
                    if(regraAtendimento.id === id) {
                        objRegraAtendimento.atendimentoDiaEspecifico[dia].splice(index, 1)
                        return true
                    }else{
                        return false
                    }
                })
            )
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