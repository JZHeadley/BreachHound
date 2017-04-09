/**
 * Created by austin on 4/8/17.
 */
var tmo = require('./nessie');
var customerDict = {};
var merchantDict = {};
var transactionDict = {};
var accountDict = {};
var dictionaries = {};

function preload(callback) {
    tmo.getCustomers(function (returnVals) {
        for (var i = 0; i < returnVals.length; i++) {
            customerDict[returnVals[i]._id] = returnVals[i];
            /*            customerDict.push({
             key: returnVals[i]._id,
             value: returnVals[i]
             });*/
        }
        dictionaries['customers'] = customerDict;
        /*dictionaries.push({
         key: 'customers',
         value: customerDict
         });*/

        tmo.getAccounts(function (returnVals) {
            for (var i = 0; i < returnVals.length; i++) {
                accountDict[returnVals[i]._id] = returnVals[i];
                /*accountDict.push({
                 key: returnVals[i]._id,
                 value: returnVals[i]
                 });*/
            }
            dictionaries['accounts'] = accountDict;
            /*dictionaries.push({
             key: 'accounts',
             value: accountDict
             });*/

            tmo.getMerchants(223, [], function (returnVals) {
                /*console.log("RETURN VALS "+returnVals.length);
                 for (var i = 0; i < returnVals.length; i++) {
                 console.log("RETURN VALS DATA "+returnVals[i].data.length);
                 for (var j = 0; j < returnVals[i].data.length; j++) {
                 console.log("JSON  "+JSON.parse(returnVals[i]).data[j]._id);
                 merchantDict[JSON.parse(returnVals[i]).data[j]._id] = JSON.parse(returnVals[i]).data[j];
                 }
                 }*/
                //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + JSON.stringify(returnVals[0].data[0]) + " !!!!!!!!!!!!!!!!!!!!!!!!!!");
                for (var i = 0; i < returnVals.length; i++) {
                    for (var j = 0; j < returnVals[i].data.length; j++) {
                        merchantDict[returnVals[i].data[j]._id] = returnVals[i].data[j];
                        //console.log(returnVals[i].data[j]);
                    }
                }

                dictionaries['merchants'] = merchantDict;

                var acctIds = Object.keys(accountDict);
                // console.log("acctIds before insane recursive callback: " + acctIds);
                tmo.insaneRecursiveCallback(acctIds, [], function (returnVals) {
                    //console.log("in getTransactions callback, returnVals: " + returnVals)
                    for (var i = 0; i < returnVals.length; i++) {
                        transactionDict[returnVals[i]._id] = returnVals[i];

                    }
                    dictionaries['purchases'] = transactionDict;
                    callback(dictionaries);
                });
                /*tmo.getTransactions(accountDict, function (returnVals) {
                 console.log("in getTransactions callback: " + returnVals[0])
                 for (var i = 0; i < returnVals.length; i++) {
                 transactionDict[returnVals[i]._id] = returnVals[i];

                 }
                 dictionaries['purchases'] = transactionDict;
                 callback(dictionaries);
                 });*/
                /*tmo.getTransactions(function (returnVals) {
                 for (var i = 0; i < returnVals.length; i++) {
                 transactionDict[returnVals[i]._id] = returnVals[i];

                 }
                 dictionaries['purchases'] = transactionDict;
                 callback(dictionaries);
                 });*/
            });
        });
    });
}
module.exports = {preload: preload};
