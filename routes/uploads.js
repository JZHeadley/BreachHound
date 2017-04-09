var express = require('express')
var router = express.Router();
var multer = require('multer');
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
        console.log(fileLocation);

        res.end("" + fileLocation);
    })
});
module.exports = router;