var addressPool = [];
var merchants = {};
var merchantsByZipCode = {};
var accounts = {};
var purchases = {};
var customers = {};
var dataPoints = {};
var confirmedFraud = [];


var pre = require('../services/preload');

var exampleFraudReport = ["58e99ae2ceb8abe24250b988", "58e99ae2ceb8abe24250b989", "58e99ae2ceb8abe24250b98c"]
function doAnalysis(fraudReport, callback) {
    pre.preload(function (hDic) {
        //console.log(hDic['merchants']['57cf75cea73e494d8675ec5b'].geocode);
        confirmedFraud = fraudReport;
        merchants = hDic['merchants'];
        customers = hDic['customers'];
        accounts = hDic['accounts'];
        purchases = hDic['purchases'];
        //console.log("update TYPEOF purchases" + typeof(purchases))
        for (var m in merchants) {
            merch = merchants[m];
            if (merchantsByZipCode[merch.address.zip] == null) {
                merchantsByZipCode[merch.address.zip] = [merch];
            } else {
                merchantsByZipCode[merch.address.zip].push(merch);
            }
        }

        analyze();
        callback(dataPoints);
    });
}

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
        distanceFromHome: 55.2420,
        address: "2200 W. Grace St., Richmond, VA 23181"
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
        confirmedFraud: 1,
        address: "2200 W. Grace St., Richmond, VA 23181"
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
        geoCode: {lat: 37.539, lng: -77.40},
        confirmedFraud: 0,
        dateInSeconds: 74200240802420,
        distanceFromHome: 55.2420,
        address: "2200 W. Grace St., Richmond, VA 23181"
    };
    return [p2, p1, p3];
}



function analyze(){
    for (var p in purchases) {
        var purch = purchases[p];
        var dp = {
            _id: purch._id,
            type: "merchant",
            merchant_id: purch.merchant_id,
            payer_id: purch.payer_id,
            purchase_date: purch.purchase_date, //use this
            amount: purch.amount,
            status: "completed",
            medium: "balance",
            accountNumber: purch.account_number,  //display
            merchantName: merchants[purch.merchant_id].name, //display
            geoCode: merchants[purch.merchant_id].geocode,  //use this
            confirmedFraud: 0,
            dateInSeconds: convertDate(purch.purchase_date),
            distanceFromHome: 55.2420,
            address: merchants[purch.merchant_id].address
        };
        for (var fraudId in confirmedFraud) {
            if (fraudId = dp._id) {
                dp.confirmedFraud = 1;
                console.log("CONFIRMED FRAUD:");
                console.log(dp);
            }
        }

    }

}


function convertDate(date) {
    parts = date.split("-")
    var d = new Date(parts[0], parts[1], parts[2]);
    return d.getTime();
}
// function analyze(arrayOfDictionaries) {

/*function findMerchantInfo(p) {
    var merchantName;
    var merchantLat;
    var merchantLon;
    pre.preload(function (hugeDictionary) {
        nessie.getMerchant(p.merchant_id, function (merchant) {
            merchantName = merchant.first_name;
            merchantLat = merchant.geocode.lat;
            merchantLon = merchant.geocode.lng;
        })
        var x = [];
        x.push(merchantName);
        x.push(merchantLat);
        x.push(merchantLon);
        return x;
    });
}*/

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

//var x = getSampleCluster();
//console.log(x);
// var y = findMerchantInfo(x[2]);



doAnalysis(exampleFraudReport, function(){return;})
module.exports = {
    getSampleCluster: getSampleCluster,
    doAnalysis: analyze,
    distance: distance
};


