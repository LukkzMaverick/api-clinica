const fs = require('fs')
const MESSAGES = require('../utils/messages')
const { v4: uuidv4 } = require('uuid')
const { initJson } = require('../facade/regraAtendimentoFacade')
const arquivoRegraAtendimento = './json/regraAtendimento.json'
const moment = require('moment')

module.exports = {

    async index(req, res) {
        try {
            let response;
            try {
                response = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'))
            } catch (error) {
                return res.status(404).send({ errors: [{ msg: MESSAGES.JSON_VAZIO_REGRA_ATENDIMENTO }] })
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async create(req, res) {
        try {
            const { tipo, dias, data, intervalos } = req.body
            let parseJson
            try {
                parseJson = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'));
            } catch (error) {
                parseJson = initJson()
            }
            if (tipo === 'ATENDIMENTO_DIARIO') {
                parseJson.atendimentoDiario.push({ intervalos, id: uuidv4() })
            }
            if (tipo === 'ATENDIMENTO_SEMANAL') {
                const objIntervalo = { intervalos, id: uuidv4() }
                if (!dias) {
                    return res.status(500).send({ errors: [{ msg: MESSAGES.DIAS_REQUIRED }] })
                } else if (dias.length === 0) {
                    return res.status(500).send({ errors: [{ msg: MESSAGES.DIAS_LENGTH }] })
                }
                for (const dia of dias) {
                    parseJson.atendimentoSemanal[dia].push(objIntervalo)
                }
            }
            if (tipo === 'ATENDIMENTO_DIA_ESPECIFICO') {
                try {
                    parseJson.atendimentoDiaEspecifico[data].push({ intervalos, id: uuidv4() })
                } catch (error) {
                    parseJson.atendimentoDiaEspecifico[data] = []
                    parseJson.atendimentoDiaEspecifico[data].push({ intervalos, id: uuidv4() })
                }
            }
            fs.writeFile(arquivoRegraAtendimento, JSON.stringify(parseJson), function (err) {
                if (err) return res.status(500).send({ errors: [{ msg: MESSAGES.ERRO_SALVAR_ARQUIVO_JSON }] })
                return res.status(204).send()
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async delete(req, res) {
        try {
            let objRegraAtendimento
            try {
                objRegraAtendimento = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'))
            } catch (error) {
                return res.status(500).send({ errors: [{ msg: MESSAGES.ID_NAO_EXISTE }] })
            }
            const { id } = req.params
            let removido = objRegraAtendimento.atendimentoDiario.find((regraAtendimento, index) => {
                if (regraAtendimento.id === id) {
                    objRegraAtendimento.atendimentoDiario.splice(index, 1)
                    return true
                } else {
                    return false
                }
            })
            if (removido) {
                return fs.writeFile(arquivoRegraAtendimento, JSON.stringify(objRegraAtendimento), function (err) {
                    if (err) return res.status(500).send({ errors: [{ msg: MESSAGES.ERRO_SALVAR_ARQUIVO_JSON }] })
                    return res.status(204).send()
                })
            }
            Object.keys(objRegraAtendimento.atendimentoSemanal).forEach((dia) => {
                objRegraAtendimento.atendimentoSemanal[dia].forEach((regraAtendimento, index) => {
                    if (regraAtendimento.id === id) {
                        objRegraAtendimento.atendimentoSemanal[dia].splice(index, 1)
                        removido = true
                    }
                })
            })
            if (removido) {
                return fs.writeFile(arquivoRegraAtendimento, JSON.stringify(objRegraAtendimento), function (err) {
                    if (err) return res.status(500).send({ errors: [{ msg: MESSAGES.ERRO_SALVAR_ARQUIVO_JSON }] })
                    return res.status(204).send()
                })
            }
            removido = Object.keys(objRegraAtendimento.atendimentoDiaEspecifico).find((dia) =>
                objRegraAtendimento.atendimentoDiaEspecifico[dia].find((regraAtendimento, index) => {
                    if (regraAtendimento.id === id) {
                        objRegraAtendimento.atendimentoDiaEspecifico[dia].splice(index, 1)
                        if (objRegraAtendimento.atendimentoDiaEspecifico[dia].length === 0)
                            delete objRegraAtendimento.atendimentoDiaEspecifico[dia]
                        return true
                    } else {
                        return false
                    }
                })
            )
            if (removido) {
                return fs.writeFile(arquivoRegraAtendimento, JSON.stringify(objRegraAtendimento), function (err) {
                    if (err) return res.status(500).send({ errors: [{ msg: MESSAGES.ERRO_SALVAR_ARQUIVO_JSON }] })
                    return res.status(204).send()
                })
            } else {
                return res.status(500).send({ errors: [{ msg: MESSAGES.ID_NAO_EXISTE }] })
            }

        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },

    async horariosDisponiveis(req, res) {
        try {
            const { dataInicio, dataFim } = req.body
            let json
            try {
                json = await JSON.parse(fs.readFileSync(arquivoRegraAtendimento, 'utf8'));
            } catch (error) {
                return res.status(404).send({ errors: [{ msg: MESSAGES.JSON_VAZIO_REGRA_ATENDIMENTO }] })
            }
            function getDates(startDate, stopDate) {
                var dateArray = [];
                var currentDate = moment(startDate, 'DD-MM-YYYY');
                var stopDate = moment(stopDate, 'DD-MM-YYYY');
                while (currentDate <= stopDate) {
                    let date = new Date(moment(currentDate, 'DD-MM-YYYY'))
                    dateArray.push({ dia: date.getDay(), data: moment(currentDate).format('DD-MM-YYYY') })

                    currentDate = moment(currentDate).add(1, 'days');
                }
                return dateArray;
            }

            dateArray = getDates(dataInicio, dataFim)
            let response = []
            for (const dataObj of dateArray) {
                let intervalos = []
                if (json.atendimentoSemanal[dataObj.dia]?.intervalos) {
                    intervalos = json.atendimentoSemanal[dataObj.dia].intervalos
                }
                for (const regraAtendimento of json.atendimentoDiario) {
                    intervalos.push(...regraAtendimento.intervalos)
                }
                try {
                    for (const regraAtendimento of json.atendimentoDiaEspecifico[dataObj.data]) {
                        intervalos.push(...regraAtendimento.intervalos)
                    }
                } catch (error) {}
                response.push({ dia: dataObj.data, intervalos })
            }
            return res.status(200).json(response)
        } catch (error) {
            console.error(error)
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    }
}