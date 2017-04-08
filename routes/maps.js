var express = require('express');
var router = express.Router();
var anal = require('../model/analysis');

router.get('/', function (req, res, next) {
    res.render("googleMaps", {purchases: anal.getSampleCluster()});
});

module.exports = router;
