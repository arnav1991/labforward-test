let express = require('express');
let router = express.Router();
let instrumentRoute = require('./instrument');

router.use('/instrument', instrumentRoute);

module.exports = router;
