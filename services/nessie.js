/**
 * Created by austin on 4/8/17.
 */
var express = require('express');
var request = require('request');
var apiKey = "b3fcbcb25a34e25b192977369a20b3cf";
var app = express();
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
    request('http://api.reimaginebanking.com/merchants?key=' + apiKey, function (err, resp, body) {
        var x = JSON.parse(body);
        callback(x);
    });
}

function getTransactions(callback) {
    var transactions = [];

    getMerchants(function (returnVal) {
        for(var i =0; i < returnVal.data.length; i++)
        {
            request('http://api.reimaginebanking.com/merchants/'+returnVal.data[i]._id+'/purchases?key=' + apiKey, function (err, resp, body) {
                transactions.push(JSON.parse(body));
                //console.log(JSON.parse(body));
            });
        }
        callback(transactions);
    });
}

function createCustomer(custData) {
    request({
        url: "http://api.reimaginebanking.com/customers?key=b3fcbcb25a34e25b192977369a20b3cf",
        method: "POST",
        json: true,
        body: custData
    }, function (error, response, body){
        console.log(response);
    });
}



module.exports = {
    getCustomers: getCustomers,
    getAccounts:getAccounts,
    getAccountByCustomer:getAccountByCustomer,
    getMerchants:getMerchants,
    getTransactions:getTransactions
};