/**
 * Created by pjhud on 4/8/2017.
 */

var addressPool = {};

var merchants = {};
var accounts = {};


var merchantsByState = {}





function randomElement(arr){
    var index = parseInt(Math.random()*arr.length);
    return arr[index];
}
function randomKey(dict) {
    return randomElement(dict.keySet);
}

function genNormalPurch() {
    var p = {
        _id: parseInt(Math.random * 100000000).toString(),
        type: "merchant",
        merchant_id: randomKey(merchants),
        payer_id: randomKey(accounts),

        x: Math.random() * 90,
        y: Math.random() * 90,
        t: Math.random() * 100000,
        d: Math.random() * 0.5/Math.random(),
        m: merchants[parseInt(Math.random() * merchants.length)]
    };
    return p;
}


var testAddress = {

};







