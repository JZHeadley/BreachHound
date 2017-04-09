/**
 * Created by austin on 4/8/17.
 */
var dict = require('./preload');
var data = require('../model/testData');
//var nessie = require('./nessie');
var anal = require('../model/analysis');

dict.preload(function (returnValue) {
    console.log("MERCHANTS LENGTH" + returnValue['merchants'].length);
    //anal.analyze(returnValue);
    //nessie.createCustomer(data.genNewCustomer());
});