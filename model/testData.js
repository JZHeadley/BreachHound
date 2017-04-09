var addressPool = [];
var merchants = {};
var merchantsByZipCode = {};
var accounts = {};
var purchases = {};
var customers = {};
//var randomUser = require('random-user');

function randomElement(arr) {
    var index = parseInt(Math.random() * arr.length);
    return arr[index];
}
function randomKey(dict) {
    //console.log("DICT[1]" + dict['1'].first_name);
    var ks = []
    for (var k in dict) {
        ks.push(k);
    }
    return randomElement(ks);
}

function randomDigits(numDigits) {
    var digs = parseInt(10000 * Math.random()).toString();
    for (var i = 0; i < numDigits - 4; i++) {
        digs = "1" + digs;
    }
    return digs;
}


var names = ["Zach", "William", "Wilson", "John", "Bob"];

function randomName() {
    return randomElement(names);
}

function randomMerchantName() {  //TODO
    return "Joe's Shoe Parlor";
}


function geoCodeByAddress(address) {
    var cd = {
        lat: 35.7,
        lng: -43.2
    };
    return cd;
}

/*function genNewCustomer() {
 randomUser('simple')
 .then((data) => {
 var c = {
 first_name: data.firstName,
 last_name: data.lastName,
 address: randomElement(addressPool)
 };
 customers[c.id] = c;
 return c;
 }).catch((err) => console.err(err));
 }*/

function genNewCustomer() {
    fillAddressPool();
    var c = {
        //_id: randomDigits(24),
        first_name: randomName(),
        last_name: randomName(),
        address: randomElement(addressPool)
    };
    customers[c.id] = c;
    return c;
}


function genNewAccount(cust_id) {
    var a = {
        //_id: randomDigits(24),
        type: "Credit Card",
        nickname: randomDigits(4),
        rewards: 0,
        balance: 999999999999,
        account_number: randomDigits(24),
        customer_id: cust_id
    };
    accounts[a._id] = a;
    return a;
}


function genNewMerchant() {
    fillAddressPool();
    var addr = randomElement(addressPool)
    var m = {
        _id: randomDigits(24),
        name: randomMerchantName(),
        category: ["Food"], //TODO
        address: addr,
        geoCode: geoCodeByAddress(addr)
    };
    merchants[m._id] = m;
    return m;
}


function genPurchase(acc_id, merch_id) {
    var p = {
        _id: randomDigits(24),
        type: "merchant",
        merchant_id: merch_id,
        payer_id: acc_id,
        purchase_date: "2017-04-18",
        amount: Math.round(Math.random() * 10000) / 100,
        status: "completed",
        medium: "balance"
    };
    console.log(p);
    purchases[p._id] = p;
    return p;
}

function genNormalPurchase() {
    var p = {
        _id: randomDigits(24),
        type: "merchant",
        merchant_id: randomKey(merchants),
        payer_id: randomKey(accounts),
        purchase_date: "2017-04-18",
        amount: Math.round(Math.random() * 10000) / 100,
        status: "completed",
        medium: "balance"
    };
    purchases[p._id] = p;
    return p;
}

function fillAddressPool() {
    var fs = require('fs');
    var address = {};
    var text = fs.readFileSync(__dirname + "/addresses.txt").toString('utf-8')
    // console.log(text);
    var textByLine = text.split("\r\n");
    // console.log(textByLine);
    textByLine.forEach(function (line) {
        address = {};
        var split = line.split(",");
        var street = split[0].split(" ");
        var state = split[2].toString().trim().split(" ");

        address.street_number = street[0];
        address.street_name = split[0].substring(address.street_number.length);
        address.city = split[1];
        address.state = state[0];
        address.zip = (state[1] + "").substring(0, 5);
        addressPool.push(address);
    });
}

/*console.log(genNewCustomer());
 console.log(genNewAccount());
 console.log(genNewMerchant());
 console.log(genNormalPurchase());*/


var nessie = require('../services/nessie');
var pre = require('../services/preload');
function update(continuation) {
    pre.preload(function (hDic) {
        //console.log(hDic['merchants']['57cf75cea73e494d8675ec5b'].geocode);
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

        continuation()
    });
}

function doNothing() {
    return;
}

function createCustomers(n) {
    var newCustomers = [];
    for (var i = 0; i < n; i++) {
        c = genNewCustomer();
        //newCustomers.push(c);
        console.log(c);
        nessie.createCustomer(c, function (id) {
            var a = genNewAccount(id);
            console.log(a);
            nessie.createAccount(a);
        });
    }
    //return newCustomers
}
//createCustomers(1);


/**Display useful zipcodes**/
/*update(function () {
    console.log("TotalMerchants: " + Object.keys(merchants).length);
    for (var z in merchantsByZipCode) {
        if (merchantsByZipCode[z].length > 0) {
            console.log("Zip: " + z + " Count: " + merchantsByZipCode[z].length);
        }
    }
    console.log("purchases: " + Object.keys(purchases));
})*/

function simulateFraud(numCards, cppMerchant_id, exploitZipcode){
    var fraudPurchases = [];
    update(function() {

        for (var i = 0; i < numCards; i++) {
            var compromisedCard = accounts[randomKey(accounts)];
            pExploit = genPurchase(compromisedCard._id, randomElement(merchantsByZipCode[exploitZipcode])._id);
            console.log("pExploit generated: " + pExploit)
            nessie.createPurchase(pExploit, console.log);
            fraudPurchases.push(pExploit);
            pCompromise = genPurchase(compromisedCard._id, cppMerchant_id);
            nessie.createPurchase(pCompromise, doNothing);
            p1 = genPurchase(compromisedCard._id, merchants[randomKey(merchants)]._id);
            nessie.createPurchase(p1, doNothing);
            p2 = genPurchase(compromisedCard._id, merchants[randomKey(merchants)]._id);
            nessie.createPurchase(p2, doNothing);
            p3 = genPurchase(compromisedCard._id, merchants[randomKey(merchants)]._id);
            nessie.createPurchase(p3, doNothing);
        }
        //console.log(fraudPurchases);
    })
    //return fraudPurchases;
}
//simulateFraud(10, "57cf75cea73e494d8675ec49", 14850)



module.exports = {
    genNewCustomer: genNewCustomer,
    genNewAccount: genNewAccount,
    genNewMerchant: genNewMerchant,
    genNormalPurchase: genNormalPurchase,
    fillAddressPool: fillAddressPool,
};




