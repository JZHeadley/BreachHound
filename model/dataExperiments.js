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

/*<script src="https://maps.google.com/maps?file=api&amp;v=3&amp;sensor=false"
type="text/javascript"></script>

var geocoder = new google.maps.Geocoder();
var address = "new york";

geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        console.log(latitude);
    }
});*/

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAuPcuo-7oFqieEYb62SmifV4rSGfxgunA', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// Using callback
geocoder.geocode('2300 W. Grace St, Richmond, VA 23220', function(err, res) {
    console.log(res[0].longitude);
});

