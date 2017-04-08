/**
 * Created by austin on 4/8/17.
 */
var tmo = require('./nessie');
var customerDict = [];
var merchantDict = [];
var transactionDict = [];
var accountDict = [];
var dictionaries = [];

function preload(callback) {
    tmo.getCustomers(function (returnVals) {
        for (var i = 0; i < returnVals.length; i++) {
            customerDict.push({
                key: returnVals[i]._id,
                value: returnVals[i]
            });
        }
        dictionaries.push({
            key: 'customers',
            value: customerDict
        });

        tmo.getAccounts(function (returnVals) {
            for (var i = 0; i < returnVals.length; i++) {
                accountDict.push({
                    key: returnVals[i]._id,
                    value: returnVals[i]
                });
            }
            dictionaries.push({
                key: 'accounts',
                value: accountDict
            });

            tmo.getMerchants(function (returnVals) {
                for (var i = 0; i < returnVals.data.length; i++) {
                    merchantDict.push({
                        key: returnVals.data[i]._id,
                        value: returnVals.data[i]
                    });
                }
                dictionaries.push({
                    key: 'merchants',
                    value: merchantDict
                });

                tmo.getTransactions(function (returnVals) {
                    for (var i = 0; i < returnVals.length; i++) {
                        transactionDict.push({
                            key: returnVals[i]._id,
                            value: returnVals[i]
                        });
                    }
                    dictionaries.push({
                        key: 'transactions',
                        value: transactionDict
                    });
                    callback(dictionaries);
                });
            });
        });
    });
}
module.exports = {preload: preload};
