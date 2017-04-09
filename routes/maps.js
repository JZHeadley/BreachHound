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
    var NodeGeocoder = require('node-geocoder');
    var options = {
        provider: 'google',
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyAuPcuo-7oFqieEYb62SmifV4rSGfxgunA', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };
    var geocoder = NodeGeocoder(options);
    var sus = anal.getWorstSuspect();
    // var location = geocoder.geocode(sus.address.street_number + " " + sus.address.street_name + ", " + sus.address.city
    //     + ", " + sus.address.state).then(function (res) {
    console.log(res);
    client.transmissions.send({
        content: {
            from: 'admin@breachhound.jzheadley.com',
            subject: 'Data Breach!',
            html: '<html><body><img src="https://maps.googleapis.com/maps/api/staticmap?center=' + sus.address.city + ", " + sus.address.state +
            '&markers=color:blue%7Clabel:S%7C' +// res.latitude + "," + res.longitude +
            '&zoom=13&size=600x300&maptype=roadmap&key=AIzaSyDAIKPAwLgMTGCKleenrLuZym41xKG-wyE"/> <p>' + anal.getEmailText() + '</p></body></html>'
        },
        recipients: [
            {address: 'headleyjz@vcu.edu'}
        ]
    })
        .then(data => {
            console.log('Woohoo! You just sent your first mailing!');
            console.log(data);
        })
        .catch(err => {
            console.log('Whoops! Something went wrong');
            console.log(err);
        });
    console.log(results);
})

// });


module.exports = router;
