/**
 * Created by pjhud on 4/8/2017.
 */

var merchants = ["a", "b", "c", "d", "e", "f", "g", "h"];

function genPurch() {
    var p = {
        x: Math.random() * 90,
        y: Math.random() * 90,
        t: Math.random() * 100000,
        d: Math.random() * 0.5/Math.random(),
        m: merchants[parseInt(Math.random() * merchants.length)]
    };
    return p;
}

function genFraud(x0, y0, t0, d0, merch) {
    var p = {
        x: x0 + Math.random() * 0.5,
        y: x0 + Math.random() * 0.5,
        t: t0 + Math.random() * 10,
        d: d0,
        m: merch
    };
    return p;
}



var ps = [];
for (var i = 0; i < 90; i++) {
    ps.push(genPurch());
}
for (var i = 0; i < 3; i++) {
    ps.push(genFraud(10, 20, 9000, 75, "Bobs pawn"));
}




