var addressPool = [];
var merchants = {};
var merchantsByState = {};
var accounts = {};
var purchases = {};
var customers = {};
var randomUser = require('random-user');

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
    for (var i = 0; i <= numDigits - 4; i++) {
        digs = "1" + digs;
    }
    return digs;
}

function randomName() {
    return "Bob";
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

function genNewCustomer() {
    randomUser('simple')
        .then((data) = > {
        var c = {
            first_name: data.firstName,
            last_name: data.lastName,
            address: randomElement(addressPool)
        }
        customers[c._id] = c;
    return c;
}).
    catch((err) = > console.err(err)
)
}

function genNewAccount() {
    var a = {
        _id: randomDigits(24),
        type: "Credit Card",
        nickname: randomDigits(4),
        rewards: 0,
        balance: 999999999999,
        account_number: randomDigits(24),
        customer_id: randomKey(customers)
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
        address.zip = state[1];
        addressPool.push(address);
    });
}

console.log(genNewCustomer());
console.log(genNewAccount());
console.log(genNewMerchant());
console.log(genNormalPurchase());


var pre = require('../services/preload');

/*function reload(){
 pre.preload(function ())
 }*/


module.exports = {
    genNewCustomer: genNewCustomer,
    genNewAccount: genNewAccount,
    genNewMerchant: genNewMerchant,
    genNormalPurchase: genNormalPurchase,
    fillAddressPool: fillAddressPool,
};




