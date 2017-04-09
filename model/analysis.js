var addressPool = [];
var merchants = {};
var purchasesByAccount = {};
var accounts = {};
var purchases = {};
var customers = {};
var dataPointDic = {};
var confirmedFraud = [];
var confirmedFraudDPs = [];

var worstSuspect = "None";
var worstCommonality = 0;


var pre = require('../services/preload');

var exampleFraudReport = ["58e9f0b7ceb8abe24250c1f5",
    "58e9f0b8ceb8abe24250c202",
    "58e9f0b8ceb8abe24250c206",
    "58e9f0b8ceb8abe24250c203",
    "58e9f0b8ceb8abe24250c20b",
    "58e9f0b8ceb8abe24250c20c"];
function doAnalysis(fraudReport, callback) {
    pre.preload(function (hDic) {
        //console.log(hDic['merchants']['57cf75cea73e494d8675ec5b'].geocode);
        confirmedFraud = fraudReport;
        merchants = hDic['merchants'];
        console.log("Total Merchants: " + Object.keys(merchants).length);
        customers = hDic['customers'];
        accounts = hDic['accounts'];
        purchases = hDic['purchases'];
        //console.log("update TYPEOF purchases" + typeof(purchases))
        for (var p in purchases) {
            var purch = purchases[p];
            if (purch.payer_id === '58e996b6ceb8abe24250b8f4') {
                console.log("Purch for 8f4" + purch._id + " merch: " + purch.merchant_id);
            }
            if (purchasesByAccount[purch.payer_id] == null) {
                purchasesByAccount[purch.payer_id] = [purch];
            } else {
                purchasesByAccount[purch.payer_id].push(purch);
            }
        }

        analyze();
        var dataPoints = [];
        for (var id in dataPointDic) {
            dataPoints.push(dataPointDic[k]);
        }
        callback(dataPoints);
    });
}

function getSampleCluster(fraudReport, callback) {
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
        confirmedFraud: 2,
        dateInSeconds: 74200240802420,
        distanceFromHome: 55.2420,
        address: "2200 W. Grace St., Richmond, VA 23181"
    };
    callback([p2, p1, p3]);
}

function analyze(){
    pre.preload(function (dict) {
        merchants = dict['merchants'];
        for (var p in purchases) {
            var purch = purchases[p];
            //console.log("MERCHANT ID: " + purch.merchant_id);
            var dp = {
                _id: purch._id,
                type: "merchant",
                merchant_id: purch.merchant_id,
                payer_id: purch.payer_id,
                purchase_date: purch.purchase_date, //use this
                amount: purch.amount,
                status: "completed",
                medium: "balance",
                accountNumber: accounts[purch.payer_id].account_number, //display
                merchantName: merchants[purch.merchant_id].name, //display
                geoCode: merchants[purch.merchant_id].geocode,  //use this
                confirmedFraud: 0,
                dateInSeconds: convertDate(purch.purchase_date),
                distanceFromHome: 55.2420,
                address: merchants[purch.merchant_id].address
            };

            //console.log(dp);
            dataPointDic[dp._id] = dp;
        }

        for (var i = 0; i < confirmedFraud.length; i++) {
            //console.log(dp._id + "/" + confirmedFraud[i]);
            var fdp = dataPointDic[confirmedFraud[i]];
            if (fdp != null) {
                fdp.confirmedFraud = 1;
                confirmedFraudDPs.push(fdp);
                //console.log("CONFIRMED FRAUD:");
                //console.log();
            } else {
                console.log("WARNING: couldn't find fraud purch " + confirmedFraud[i])
            }
        }

        //console.log(Object.keys(dataPointDic));
        //console.log("LOOKING FOR: " + dataPointDic["58e99ae2ceb8abe24250b988"]._id);
        //console.log("LOOKING FOR: " + dataPointDic["58e99ae2ceb8abe24250b989"]._id);
        //console.log("LOOKING FOR: " + dataPointDic["58e99ae2ceb8abe24250b98c"]._id);
        console.log("CONFIRMED FRAUD:");
        //console.log(Object.keys(confirmedFraudDPs));
        console.log(confirmedFraudDPs);
        findCPP();
        markPurchasesForMerch(worstSuspect);
    });
}


function findCPP() {
    var merchantCounts = {};
    for (var i = 0; i < confirmedFraudDPs.length; i++) {
        var fdp = confirmedFraudDPs[i];
        var compAcct = fdp.payer_id;
        var possCompPurchases = purchasesByAccount[compAcct];
        //console.log(possCompPurchases.length + " suspect purchases for " + compAcct);
        var suspectMerchs = {};
        for (var j = 0; j < possCompPurchases.length; j++) {
            suspectMerchs[possCompPurchases[j].merchant_id] = "yep";
            //console.log("Suspect Merch:" + possCompPurchases[j].merchant_id + "for acct" + compAcct);
        }
        //console.log(Object.keys(suspectMerchs) + " are suspect purchases for " + compAcct);
        for (var smid in suspectMerchs) {
            console.log("FDP merchid: " + smid);
            //var suspectMerch = merchants[smid].merchant_id;
            if (merchantCounts[smid] == null) {
                merchantCounts[smid] = 1;
            } else {
                merchantCounts[smid] += 1;
            }
        }

    }

    for (var m in merchantCounts) {
        //console.log("MerchantcountID: "+  m);
        console.log("Merchant: " + m + ", Commonality: " + merchantCounts[m]);
        if (merchantCounts[m] >= worstCommonality) {
            worstSuspect = m;
            worstCommonality = merchantCounts[m];
        }
        //console.log("Merchant: " + merchants[m].name + ", Commonality: " + merchantCounts[m]);
    }
}

function markPurchasesForMerch(merchant) {
    for (var ak in purchasesByAccount) {
        var purchaseList = purchasesByAccount[ak];
        var comprimised = false;
        for (var i = 0; i < purchaseList.length; i++) {
            if (purchaseList[i].merchant_id = merchant){
                comprimised = true;
            }
        }
        if (comprimised) {
            for (var i = 0; i < purchaseList.length; i++) {
                dataPointDic[purchaseList[i]._id].confirmedFraud = 2;
            }
        }
    }

    for (var dpk in dataPointDic) {
        if (dataPointDic[dpk].merchant_id = merchant) {
            dataPointDic[dpk].confirmedFraud = 3;
        }
    }
}

function convertDate(date) {
    parts = date.split("-")
    var d = new Date(parts[0], parts[1], parts[2]);
    return d.getTime();
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
    //console.log(res[0].longitude);
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
    doAnalysis: doAnalysis,
    distance: distance
};


