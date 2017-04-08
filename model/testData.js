/**
 * Created by pjhud on 4/8/2017.
 */

var addressPool = [];
var merchants = {};
var merchantsByState = {};
var accounts = {};
var purchases = {};
var customers = {};


/*x: Math.random() * 90,
    y: Math.random() * 90,
    t: Math.random() * 100000,
    d: Math.random() * 0.5/Math.random(),
    m: merchants[parseInt(Math.random() * merchants.length)]*/


function randomElement(arr){
    var index = parseInt(Math.random()*arr.length);
    return arr[index];
}
function randomKey(dict) {
    //console.log("DICT[1]" + dict['1'].first_name);
    var ks = []
    for (var k in dict) {
        ks.push(k);
    }
    //console.log(ks)
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
    var c = {
        //_id: randomDigits(24),
        first_name: randomName(),
        last_name: randomName(),
        address: randomElement(addressPool)
    };
    customers[c._id] = c;
    return c;
}

function genNewAccount() {
    var a = {
        _id: randomDigits(24),
        type: "Credit Card",
        nickname: randomDigits(4),
        rewards: 0,
        balance: 999999999999,
        account_number: randomDigits(24),
        customer_id : randomKey(customers)
    };
    accounts[a._id] = a;
    return a;
}

function genNewMerchant() {
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
        amount: Math.round(Math.random() * 10000)/100,
        status: "completed",
        medium: "balance"
    };
    purchases[p._id] = p;
    return p;
}

var testAddress = {
    street_number: "1234",
    street_name: "Aweseome St.",
    city: "Richmond",
    state: "VA",
    zip: "23220"
};

addressPool.push(testAddress)




console.log(genNewCustomer())
console.log(genNewAccount())
console.log(genNewMerchant())
console.log(genNormalPurchase())

module.exports = {
    genNewCustomer: genNewCustomer,
    genNewAccount: genNewAccount,
    genNewMerchant: genNewMerchant,
    genNormalPurchase: genNormalPurchase
}




