/**
 * Created by austin on 4/8/17.
 */
var express = require('express');
var request = require('request');
var apiKey = "b3fcbcb25a34e25b192977369a20b3cf";
var app = express();
var pre = ('./preload');
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var Promise = require('Promise');
var cheerio = require('cheerio');

function getCustomers(callback) {
    request('http://api.reimaginebanking.com/customers?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

function getAccounts(callback) {
    request('http://api.reimaginebanking.com/accounts?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        //console.log("getAccounts json response: " + JSON.stringify(body));
        callback(x);
    });
}


function getAccountByCustomer(customerId, callback) {
    request('http://api.reimaginebanking.com/customers/' + customerId + '/accounts?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

/**
 * Handle multiple requests at once
 * @param urls [array]
 * @param callback [function]
 * @requires request module for node ( https://github.com/mikeal/request )
 */
var getMerchantsHelper = function (urls, callback) {
    'use strict';
    var results = {}, t = urls.length, c = 0,

        handler = function (error, response, body) {
            var url = response.request.uri.href;
            results[url] = {error: error, response: response, body: body};
            if (++c === urls.length) {
                callback(results);
            }
        };

    while (t--) {
        request(urls[t], handler);
    }
};

function getMerchantstest(callback) {
    var urls = [];
    var merchants = [];
    for (var page = 1; page <= 223; page++) {
        urls.push('http://api.reimaginebanking.com/merchants?key=' + apiKey + '&page=' + page)
    }
    getMerchantsHelper(urls, function (responses) {
        for (url in responses) {
            response = responses[url];
            console.log(response.body);
            merchants.push(response.body);
        }
    });
}

function getMerchants(callback) {
    request('http://api.reimaginebanking.com/merchants?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

function populateList(page, callback) {
    request('http://api.reimaginebanking.com/merchants?key=' + apiKey + '&page=' + page, function (err, resp, body) {
        x = body;
        callback(x);
    });
}

/*function getTransactions(callback) {
 var transactions = [];

 getMerchants(function (returnVal) {
 for(var i =0; i < returnVal.data.length; i++)
 {
 request('http://api.reimaginebanking.com/merchants/'+returnVal.data[i]._id+'/purchases?key=' + apiKey, function (err, resp, body) {
 console.log("Request text: " + 'http://api.reimaginebanking.com/merchants/'+returnVal.data[i]._id+'/purchases?key=');
 console.log("getMerchants json" + JSON.stringify(body));
 transactions.push(JSON.parse(body));

 });
 }
 callback(transactions);
 });
 }*/

function getMerchant(id, callback) {
    request('http://api.reimaginebanking.com/merchants/' + id + '?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}


/*function getAccounts(callback) {
 request('http://api.reimaginebanking.com/accounts?key=' + apiKey, function (err, resp, body) {
 var x = JSON.parse(body);
 callback(x);
 });
 }*/
function insaneRecursiveCallback(acctList, purchaseList, callback) {
    //console.log("irc number of accounts: " + acctList.length);
    if (acctList.length == 0) {
        callback(purchaseList);
    } else {
        var a_id = acctList.pop()
        request('http://api.reimaginebanking.com/accounts/' + a_id + '/purchases?key=' + apiKey, function (err, resp, body) {
            //console.log("Request text: " + 'http://api.reimaginebanking.com/accounts/' + a_id + '/purchases?key=' + apiKey);
            //console.log("getPurchases json response" + JSON.stringify(body));
            //transactions.push(JSON.parse(body));
            purchaseList = purchaseList.concat(JSON.parse(body));
            insaneRecursiveCallback(acctList, purchaseList, callback)
        })
    }
}
/*getMerchants(function (returnVal) {
 for(var i =0; i < returnVal.data.length; i++)
 {
 request('http://api.reimaginebanking.com/merchants/'+returnVal.data[i]._id+'/purchases?key=' + apiKey, function (err, resp, body) {
 console.log("Request text: " + 'http://api.reimaginebanking.com/merchants/'+returnVal.data[i]._id+'/purchases?key=');
 console.log("getMerchants json" + JSON.stringify(body));
 transactions.push(JSON.parse(body));

 });
 }
 callback(transactions);
 });*/


function createCustomer(custData, completion) {
    request({
        url: "http://api.reimaginebanking.com/customers?key=" + apiKey,
        method: "POST",
        json: true,
        body: custData
    }, function (error, response, body) {
        console.log("asdffasddfas" + JSON.stringify(body));

        var id = JSON.parse(JSON.stringify(body)).objectCreated._id;
        console.log("NEW CUST ID: " + id);
        completion(id);

    });
    pre.preload;
}

function createMerchant(merchData) {
    request({
        url: "http://api.reimaginebanking.com/merchants?key=" + apiKey,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function (error, response, body) {
        //console.log(response);
    });
    pre.preload;
}

function createAccount(accountData) {
    //accountData = JSON.stringify(accountData);
    accountForAPI = {
        type: "Credit Card",
        nickname: "nickname",
        rewards: 0,
        balance: 99999999,
        //account_number: "string"
    }

    request({
        url: "http://api.reimaginebanking.com/customers/" + accountData.customer_id + "/accounts?key=" + apiKey,
        method: "POST",
        json: true,
        body: accountForAPI
    }, function (error, response, body) {
        console.log("new acct" + JSON.stringify(body));
        //console.log("new acct id" + JSON.parse(JSON.stringify(body)).objectCreated._id);

        //console.log(response);
    });
    pre.preload;
}

function createPurchase(purchData, completion) {
    //purchData = JSON.stringify(purchData);
    var purchForAPI = {
        merchant_id: purchData.merchant_id,
        medium: purchData.medium,
        purchase_date: purchData.purchase_date,
        amount: purchData.amount,
        description: "please just create a purchase"
    }
    request({
        url: "http://api.reimaginebanking.com/accounts/" + purchData.payer_id + "/purchases?key=" + apiKey,
        method: "POST",
        json: true,
        body: purchForAPI
    }, function (error, response, body) {
        //console.log("new purch URL: " + "http://api.reimaginebanking.com/accounts/"+purchData.payer_id+"/purchases?key="+apiKey);
        //console.log("new purch" + JSON.stringify(body));
        //PRINTHERE//console.log(JSON.parse(JSON.stringify(body)).objectCreated._id);
        completion(JSON.parse(JSON.stringify(body)).objectCreated._id)
        //console.log(response);
    });
    pre.preload;
}


module.exports = {
    getCustomers: getCustomers,
    getAccounts: getAccounts,
    getAccountByCustomer: getAccountByCustomer,
    getMerchants: getMerchants,
    getMerchant: getMerchant,
    //getTransactions:getTransactions,
    insaneRecursiveCallback: insaneRecursiveCallback,
    createCustomer: createCustomer,
    createMerchant: createMerchant,
    createAccount: createAccount,
    createPurchase: createPurchase
};