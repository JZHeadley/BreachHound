var express = require('express');
var router = express.Router();
var anal = require('../model/analysis');

router.get('/', function (req, res, next) {
    anal.doAnalysis(["58e99ae2ceb8abe24250b988", "58e99ae2ceb8abe24250b989", "58e99ae2ceb8abe24250b98c"], function (results) {
        res.render("googleMaps", {purchases: results});
    })
    // res.render("googleMaps", {purchases: anal.getSampleCluster()});
});
router.get('/points', function (req, res, next) {
    // res.send(JSON.stringify(anal.getSampleCluster()));
    anal.doAnalysis(["58e99ae2ceb8abe24250b988", "58e99ae2ceb8abe24250b989", "58e99ae2ceb8abe24250b98c"], function (results) {
        res.send(JSON.stringify(results));
    })
});
module.exports = router;
