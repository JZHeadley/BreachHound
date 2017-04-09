var express = require('express');
var router = express.Router();
var clusterfck = require('clusterfck');
var testData = require('../model/dataExperiments');
var analysis = require('../model/analysis');

function leaves(cluster) {
    // flatten cluster hierarchy
    if (!cluster.left)
        return [cluster];
    else
        return leaves(cluster.left).concat(leaves(cluster.right));
}

/* GET home page. */
router.get('/', function (req, res, next) {
    var cluster = clusterfck.hcluster(testData.getPurchases(), analysis.distance(), "single");
    res.send(leaves(cluster));
});

module.exports = router;
