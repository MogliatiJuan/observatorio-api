const express = require('express');
const router = express.Router();
const controller = require('./controller_varios.js');

router.get('/ciudades', controller.getCiudades);
router.get('/provincias', controller.getProvincias);
router.get('/fueros', controller.getFueros);
router.get('/fueros_x_juzgados', controller.getFuerosXJuzgados);
router.get('/departamentos', controller.getDepartamentos);
router.get('/dependencias', controller.getDependencias);
router.get('/juzgados', controller.getJuzgados);

module.exports = router;

