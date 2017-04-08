//Display all these, sort by account number
var pre = require('../services/preload');
var nessie = require('../services/nessie');
function getSampleCluster() {
    var p1 = {
        _id: '123456789012345678901234',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18", //use this
        amount: 50,
        status: "completed",
        medium: "balance",
        accountNumber: "1234567890123456",  //display
        merchantName: "Joes house of cats", //display
        geoCode: {lat: 37.53, lng: -77.4},  //use this
        confirmedFraud: 0,  //color red/yellow
        dateInSeconds: 74200240802420,
        distanceFromHome: 55.2420
    };
    var p2 = {
        _id: '123456789012345678901235',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        dateInSeconds: 74200240802420,
        accountNumber: "1234567890123477",
        merchantName: "Joes house of cats",
        distanceFromHome: 55.2420,
        geoCode: {lat: 37.539, lng: -77.49},
        confirmedFraud: 1
    };
    var p3 = {
        _id: '123456789012345678901236',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        accountNumber: "1234567890123477",
        merchantName: "Bobs mitten parlor",
        geocode: {lat: 37.539, lng: -77.40},
        confirmedFraud: 0,
        dateInSeconds: 74200240802420,
        distanceFromHome: 55.2420
    };
    return [p2, p1, p3];
}
function convertDate(date) {
    parts = date.split("-")
    var d = new Date(parts[0], parts[1], part[2]);
    return d.getTime();
}
// function analyze(arrayOfDictionaries) {

function findMerchantInfo(p) {
    var merchantName;
    var merchantID;
    var merchantLat;
    var merchantLon;
    pre.preload(function (hugeDictionary) {
        var ks = []
        for (var k in hugeDictionary['transactions']) {
            ks.push(k);
        }
        for (var i = 0; i < ks.length; i++) {
            if (p.merchant_id == ks[i]._id) {
                merchantID = ks[i].customer_id;
            }
        }
        nessie.getMerchant(merchantID, function (merchant) {
            merchantName = merchant.first_name;
            merchantLat = merchant.geocode.lat;
            merchantLon = merchant.geocode.lng;
        })
        var x = [merchantName, merchantLat, merchantLon];
        console.log(x[0] + " " + x[1] + " " + x[2]);
        return x;
    });
}

function analyze(arrayOfDictionaries){
    console.log("Array of dictionaries:");
    console.log(arrayOfDictionaries);
}

function distance(p1, p2) {
    if (p1 !== undefined && p2 !== undefined)
        return (Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(((p1.t - p2.t) / 1000), 2))
}

var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAuPcuo-7oFqieEYb62SmifV4rSGfxgunA', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

// Using callback
geocoder.geocode('2300 W. Grace St, Richmond, VA 23220', function (err, res) {
    console.log(res[0].longitude);
});

function getDistanceFromLatLonInKm(coord1, coord2) {
    lat1 = coord1.lat;
    lon1 = coord1.lng;
    lat2 = coord2.lat;
    lon2 = coord2.lng;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
module.exports = {
    getSampleCluster: getSampleCluster,
    analyze: analyze,
    distance: distance
};
var x = getSampleCluster();
console.log(x);
var y = findMerchantInfo(x[2]);