const express = require ('express');
const router = express.Router();
const controller = require('../controllers/falloController');

router.get('/', controller.all);
router.get('/:id', controller.read);

router.post('/', controller.create);



module.exports = router;