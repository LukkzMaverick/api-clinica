const MESSAGES = require('../utils/messages');

module.exports = {

    async index(req, res) {
        try {
            return res.status(200).send("Oi")
        } catch (error) {
            return res.status(500).send({ errors: [{ msg: MESSAGES.INTERNAL_SERVER_ERROR }] })
        }
    },
}