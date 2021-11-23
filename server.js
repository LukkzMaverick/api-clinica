require('dotenv').config()
const routes = require('./routes')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8080;

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

routes(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(PORT, () => { console.log(`port ${PORT}`) })

module.exports = { app }