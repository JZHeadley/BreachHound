/**
 * Created by austin on 4/8/17.
 */
var dict = require('./preload');
var data = require('../model/testData');
var nessie = require('./nessie');
var anal = require('../model/analysis');

dict.preload(function (returnValue) {
    console.log(returnValue['merchants']['57cf75cea73e494d8675ec5b'].geocode);

    anal.analyze(returnValue);
    nessie.createCustomer(data.genNewCustomer());
});