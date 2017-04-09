var express = require('express')
var router = express.Router();
var multer = require('multer');
var anal = require('../model/analysis');

var fileLocation;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        fileLocation = file.fieldname + '-' + Date.now();
        callback(null, fileLocation);
    }
});
var upload = multer({storage: storage}).single('file');

router.post('/', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        var fs = require('fs');
        var text = fs.readFile("uploads/" + fileLocation).toString('utf-8')
        var fraudPoints = text.split("\r\n");
        anal.doAnalysis(fraudPoints, function (results) {
            res.end(JSON.stringify(results));
        });
    })
});

module.exports = router;