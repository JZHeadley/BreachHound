/**
 * Created by pjhud on 4/8/2017.
 */


//Display all these, sort by account number
function getSampleCluster() {
    var p1 = {
        _id: '123456789012345678901234',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18", //use this
        amount: 50,
        status: "completed",
        medium: "balance",
        account_number: "1234567890123456",  //display
        merchant_name: "Joes house of cats", //display
        geocode : {lat: 37.53, lng: -77.4},  //use this
        confirmed_fraud : 0  //color red/yellow
    };
    var p2 = {
        _id: '123456789012345678901235',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        account_number: "1234567890123477",
        merchant_name: "Joes house of cats",
        geocode : {lat: 37.539, lng: -77.49},
        confirmed_fraud : 1
    };
    var p3 = {
        _id: '123456789012345678901236',
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        account_number: "1234567890123477",
        merchant_name: "Bobs mitten parlor",
        geocode : {lat: 37.539, lng: -77.40},
        confirmed_fraud : 0
    };
    return [p2, p1, p3];
}

function analyze(arrayOfDictionaries){
    console.log("Array of dictionaries:");
    console.log(arrayOfDictionaries);
    return;

}


module.exports = {
    getSampleCluster: getSampleCluster,
    analyze: analyze
}
