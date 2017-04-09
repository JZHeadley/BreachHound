var express = require('express');
var router = express.Router();
var anal = require('../model/analysis');


anal.doAnalysis(["58e99ae2ceb8abe24250b988", "58e99ae2ceb8abe24250b989", "58e99ae2ceb8abe24250b98c"], function (results) {
// anal.getSampleCluster("", function (results) {
    router.get('/', function (req, res, next) {
        // res.render("googleMaps", {purchases: anal.getSampleCluster()});
        res.render("googleMaps", {purchases: results});
    });
    router.get('/points', function (req, res, next) {
        // res.send(JSON.stringify(anal.getSampleCluster()));
        res.send(JSON.stringify(results));
    });
});


module.exports = router;
