const express = require ('express');
const router = express.Router();
const controller = require('./controller_fallos');

router.get('/', controller.all);
router.get('/:id', controller.read);

router.post('/', controller.create);



module.exports = router;