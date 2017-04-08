var map;

//initializes map centered and zoomed at a specific point
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.787252, lng: -41.011963},
        zoom: 8 // typical is usually 8 or 9
    });

/*Centers maps at sets of points instead of one, we'll discuss
    var locations = [
        ['DESCRIPTION', 41.926979,12.517385, 3],
        ['DESCRIPTION', 41.914873,12.506486, 2],
        ['DESCRIPTION', 41.918574,12.507201, 1]
    ];

//create empty LatLngBounds object
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    for (i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        //extend the bounds to include each marker's position
        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

//now fit the map to the newly inclusive bounds
    map.fitBounds(bounds);*/


    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map);
}


function geocodeAddress(geocoder, resultsMap) {
    var address = "2300 W Grace St., Richmond, VA 23220"; //Make pull request from database and set address here
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            console.log(results[0].geometry.location)
            resultsMap.setZoom(18);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                icon: "/drawables/blueMapMarker.png"
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


var geocoder = new google.maps.Geocoder();
geocodeAddress(geocoder, map);


/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("tableOverlay").style.width = "0%";
}





