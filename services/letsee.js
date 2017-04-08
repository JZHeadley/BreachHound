/**
 * Created by austin on 4/8/17.
 */
var dict = require('./preload');
var data = require('../model/testData');
var nessie = require('./nessie');

dict.preload(function (returnValue) {
    for(var i = 0; i < returnValue.length; i++) {
        //console.log("I is currently:"+i);
        //console.log(returnValue[i]);
    }

    console.log(returnValue['merchants']['57cf75cea73e494d8675ec5b'].geocode);


    nessie.createMerchant(data.genNewMerchant());
});