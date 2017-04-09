var express = require('express');
var router = express.Router();
var anal = require('../model/analysis');
var SparkPost = require('sparkpost');
var client = new SparkPost('f8f0f04dec34383628500512dc2780b5f358b2e5');


anal.doAnalysis(["58e9f0b8ceb8abe24250c202", "58e9f0b8ceb8abe24250c206", "58e9f0b8ceb8abe24250c203", "58e9f0b8ceb8abe24250c20b", "58e9f0b8ceb8abe24250c20c"], function (results) {
// anal.getSampleCluster("", function (results) {
    router.get('/', function (req, res, next) {
        // res.render("googleMaps", {purchases: anal.getSampleCluster()});
        res.render("googleMaps", {purchases: results});
    });
    router.get('/points', function (req, res, next) {
        // res.send(JSON.stringify(anal.getSampleCluster()));
        res.send(JSON.stringify(results));
    });
    client.transmissions.send({
        options: {
            sandbox: true
        },
        content: {
            from: 'BreachHound@sparkpostbox.com',
            subject: 'Data Breach!',
            html: '<html><body><p>' + anal.getEmailText() + '</p></body></html>'
        },
        recipients: [
            {address: 'headleyjz@vcu.edu'}
        ]
    })
        .then(data => {
            // console.log('Woohoo! You just sent your first mailing!');
            console.log(data);
        })
        .catch(err => {
            console.log('Whoops! Something went wrong');
            console.log(err);
        });
    console.log(results);
});


module.exports = router;
