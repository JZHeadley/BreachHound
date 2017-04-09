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

function getCustomers(callback) {
    request('http://api.reimaginebanking.com/customers?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

function getAccounts(callback) {
    request('http://api.reimaginebanking.com/accounts?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        console.log("getAccounts json response: " + JSON.stringify(body));
        callback(x);
    });
}


function getAccountByCustomer(customerId, callback) {
    request('http://api.reimaginebanking.com/customers/' + customerId + '/accounts?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

function getMerchants(callback) {
    var x

    request('http://api.reimaginebanking.com/merchants?key=' + apiKey + '&page=1', function (err, resp, body) {
        x = body;
        for (var i = 2; i <= 223; i++) {
            request('http://api.reimaginebanking.com/merchants?key=' + apiKey + '&page=' + i, function (err, resp, body) {
                x = x + "" + body;
            });
        }
        x = JSON.parse(x);
        callback(x);
    });
}

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
    console.log("irc number of accounts: " + acctList.length);
    if (acctList.length == 0) {
        callback(purchaseList);
    } else {
        var a_id = acctList.pop()
        request('http://api.reimaginebanking.com/accounts/'+ a_id +'/purchases?key=' + apiKey, function (err, resp, body) {
            console.log("Request text: " + 'http://api.reimaginebanking.com/accounts/'+ a_id +'/purchases?key=' + apiKey);
            console.log("getPurchases json response" + JSON.stringify(body));
            //transactions.push(JSON.parse(body));
            purchaseList = purchaseList.concat(JSON.parse(body));
            insaneRecursiveCallback(acctList, purchaseList, callback)
        })
    }
}
/*function getTransactions(acctDict, callback) {
    var transactions = [];

    console.log("accDict Passed to getTransactions: " + Object.keys(acctDict))
    for (var a_id in acctDict) {
        request('http://api.reimaginebanking.com/accounts/'+ a_id +'/purchases?key=' + apiKey, function (err, resp, body) {
            console.log("Request text: " + 'http://api.reimaginebanking.com/accounts/'+ a_id +'/purchases?key=' + apiKey);
            console.log("getPurchases json response" + JSON.stringify(body));
            //transactions.push(JSON.parse(body));
            transactions.concat(JSON.parse(body));

        });
    }
    callback(transactions);
}*/
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

function createCustomer(custData, completion) {
    request({
        url: "http://api.reimaginebanking.com/customers?key="+apiKey,
        method: "POST",
        json: true,
        body: custData
    }, function (error, response, body){
        console.log("asdffasddfas" + JSON.stringify(body));

        var id = JSON.parse(JSON.stringify(body)).objectCreated._id;
        console.log("NEW CUST ID: " + id);
        completion(id);

    });
    pre.preload;
}

function createMerchant(merchData) {
    request({
        url: "http://api.reimaginebanking.com/merchants?key="+apiKey,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function (error, response, body){
        //console.log(response);
    });
    pre.preload;
}

function createAccount(accountData) {
    //accountData = JSON.stringify(accountData);
    request({
        url: "http://api.reimaginebanking.com/customers/"+accountData.customer_id+"/accounts?key="+apiKey,
        method: "POST",
        json: true,
        body: accountData
    }, function (error, response, body){
        console.log("new acct" + JSON.stringify(body));
        //console.log("new acct id" + JSON.parse(JSON.stringify(body)).objectCreated._id);

        //console.log(response);
    });
    pre.preload;
}

function createPurchase(purchData) {
    //purchData = JSON.stringify(purchData);
    request({
        url: "http://api.reimaginebanking.com/accounts/"+purchData.payer_id+"/purchases?key="+apiKey,
        method: "POST",
        json: true,
        body: purchData
    }, function (error, response, body){
        console.log("new purch URL: " + "http://api.reimaginebanking.com/accounts/"+purchData._id+"/purchases?key="+apiKey);
        console.log("new purch" + JSON.stringify(body));
        console.log("new purch_id" + JSON.parse(JSON.stringify(body)).objectCreated._id);
        //console.log(response);
    });
    pre.preload;
}





module.exports = {
    getCustomers: getCustomers,
    getAccounts:getAccounts,
    getAccountByCustomer:getAccountByCustomer,
    getMerchants:getMerchants,
    getMerchant: getMerchant,
    //getTransactions:getTransactions,
    insaneRecursiveCallback: insaneRecursiveCallback,
    createCustomer:createCustomer,
    createMerchant:createMerchant,
    createAccount:createAccount,
    createPurchase:createPurchase
};