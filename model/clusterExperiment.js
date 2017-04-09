/**
 * Created by pjhud on 4/9/2017.
 */



/*var dp = {
    _id: purch._id,
    type: "merchant",
    merchant_id: purch.merchant_id,
    payer_id: purch.payer_id,
    purchase_date: purch.purchase_date, //use this
    amount: purch.amount,
    status: "completed",
    medium: "balance",
    accountNumber: accounts[purch.payer_id].account_number, //display
    merchantName: merchants[purch.merchant_id].name, //display
    geoCode: merchants[purch.merchant_id].geocode,  //use this
    confirmedFraud: 0,
    dateInSeconds: convertDate(purch.purchase_date),
    distanceFromHome: 55.2420,
    address: merchants[purch.merchant_id].address
};*/


var merchants = ["a", "b", "c", "d", "e", "f", "g", "h"];

function genPurch() {
    var p = {
        x: Math.random() * 90,
        y: Math.random() * 90,
        m: "random"
    };
    return p;
}

function genFraud(x0, y0, merch) {
    var p = {
        x: x0 + Math.random() * 0.5,
        y: x0 + Math.random() * 0.5,
        m: merch
    };
    return p;
}


function getPurchases() {
    var ps = [];
    for (var i = 0; i < 90; i++) {
        ps.push(genPurch());
    }
    for (var i = 0; i < 3; i++) {
        ps.push(genFraud(10, 20, "Bobs pawn"));
    }
    return ps;
}

function distance(p1, p2) {
    if (p1 !== undefined && p2 !== undefined)
        return (Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

var clusterfck = require('clusterfck');

function leaves(cluster) {
    // flatten cluster hierarchy
    if (!cluster.left)
        return [cluster];
    else
        return leaves(cluster.left).concat(leaves(cluster.right));
}

var cluster = clusterfck.hcluster(getPurchases(), distance, "single");
console.log(leaves(cluster));