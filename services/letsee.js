/**
 * Created by austin on 4/8/17.
 */
var dict = require('./preload');

dict.preload(function (returnValue) {
    for(var i = 0; i < returnValue.length; i++) {
        //console.log("I is currently:"+i);
        //console.log(returnValue[i]);
    }

    console.log(((returnValue[0]).value[1]).value.address.street_number);
    //
});