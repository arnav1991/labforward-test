var express = require('express');
var router = express.Router();
const instrumentService = require('../services/instrument');

/* GET users listing. */
router.get('/instruments', async function (req, res, next) {
  //Limit offset not added for simplicity
  const instruments = await instrumentService.getAllInstruments();
  res.status(200).send({
    data: instruments,
  });
});

module.exports = router;
