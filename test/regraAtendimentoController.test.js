const httpMocks = require('node-mocks-http');
const assert = require('assert');
const chai = require('chai');
const regraAtendimentoController = require('../controllers/regraAtendimentoController');
describe('regraAtendimentoController tests', function () {
    it('create() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/regraAtendimento',
            body: {
                "tipo": "ATENDIMENTO_DIARIO",
                "intervalos": [{ "inicio": "13:30", "fim": "14:55" }]
            }
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.create(request, result)
        assert.equal(result._getStatusCode(), 200);
    });

    it('create() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/regraAtendimento',
            body: {
                "tipo": "ATENDIMENTO_SEMANAL",
                "intervalos": [{ "inicio": "16:30", "fim": "16:55" }],
                "dias": ["SEGUNDA", "QUARTA"]
            }
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.create(request, result)
        assert.equal(result._getStatusCode(), 200);
    });


    it('create() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/regraAtendimento',
            body: {
                "tipo": "ATENDIMENTO_DIA_ESPECIFICO",
                "intervalos": [{ "inicio": "16:30", "fim": "16:55" }],
                "data": "25-11-2022"
            }
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.create(request, result)
        assert.equal(result._getStatusCode(), 200);
    });

    
    it('index() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/regraAtendimento',
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.index(request, result)
        assert.equal(result._getStatusCode(), 200);
    });

    it('delete() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'DELETE',
            url: '/regraAtendimento/e8be0940-d83a-4ecd-8082-ffea53402642',
            params: {
                id: 'e8be0940-d83a-4ecd-8082-ffea53402642'
            }
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.delete(request, result)
        assert.equal(result._getStatusCode(), 200);
    });

    it('horariosDisponiveis() - Should return a 200', function () {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/horariosDisponiveis/listar',
            body: {
                "dataInicio": "22-01-2018",
                "dataFim": "25-01-2018"
            }
        });
        const result = httpMocks.createResponse();
        regraAtendimentoController.horariosDisponiveis(request, result)
        assert.equal(result._getStatusCode(), 200);
    });

})

