/**
 * Created by pjhud on 4/8/2017.
 */



function getSampleCluster() {
    var p1 = {
        _id: randomDigits(24),
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        account_number: "1234567890123456",
        merchant_name: "Joes house of cats",
        geocode : {lat: 37.53, lng: -77.4},
        confirmed_fraud : 0
    };
    var p1 = {
        _id: randomDigits(24),
        type: "merchant",
        merchant_id: '123456789012345678901234',
        payer_id: '123456789012345678901234',
        purchase_date: "2017-04-18",
        amount: 50,
        status: "completed",
        medium: "balance",
        account_number: "1234567890123456",
        merchant_name: "Joes house of cats",
        geocode : {lat: 37.539, lng: -77.49},
        confirmed_fraud : 0
    };
}

function analyze(arrayOfDictionaries){
    console.log("Array of dictionaries:");
    console.log(arrayOfDictionaries);
    return;

}



