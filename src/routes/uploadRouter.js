const express = require ('express');
const routerupload = express.Router();
const UPLOAD_Controller = require('../controllers/uploadController.js');




routerupload.post('/CD_RE', UPLOAD_Controller.Create_CD_RE);
routerupload.put('/CD_RE', UPLOAD_Controller.Update_CD_RE);


routerupload.post('/CD_EM', UPLOAD_Controller.Create_CD_EM);
routerupload.put('/CD_EM', UPLOAD_Controller.Update_CD_EM);


routerupload.post('/CD_AU', UPLOAD_Controller.Create_CD_AU);
routerupload.put('/CD_AU', UPLOAD_Controller.Update_CD_AU);

routerupload.post('/CD_JU', UPLOAD_Controller.Create_CD_JU);
routerupload.put('/CD_JU', UPLOAD_Controller.Update_CD_JU);


















module.exports = routerupload;