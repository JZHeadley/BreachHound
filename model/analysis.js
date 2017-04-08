/**
 * Created by pjhud on 4/8/2017.
 */


//Display all these, sort by account number
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
        geoCode : {lat: 37.53, lng: -77.4},  //use this
        confirmedFraud : 0,  //color red/yellow
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
        geoCode : {lat: 37.539, lng: -77.49},
        confirmedFraud : 1
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
        geocode : {lat: 37.539, lng: -77.40},
        confirmedFraud : 0,
        dateInSeconds: 74200240802420,
        distanceFromHome: 55.2420
    };
    return [p2, p1, p3];
}

function analyze(arrayOfDictionaries){
    console.log("Array of dictionaries:");
    console.log(arrayOfDictionaries);
    return;

}

function distance(p1, p2) {
    if (p1 != undefined && p2 != undefined)
        return (Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(((p1.t - p2.t) / 1000), 2))
}

module.exports = {
    getSampleCluster: getSampleCluster,
    analyze: analyze,
    distance: distance
};


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
geocoder.geocode('2300 W. Grace St, Richmond, VA 23220', function(err, res) {
    console.log(res[0].longitude);
});
module.exports = {
    analyze: analyze,
    getSampleCluster: getSampleCluster
};
