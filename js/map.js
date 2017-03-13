var map;

var pinDesc = [];
var pinLat = [];
var pinLng = [];

function initMap() {
    $.getJSON("myPins.json", function (json) {
        var pinDesc = new Array()
        for (i = 0; i < 3; i++)
            pinDesc[i] = new Array()

        for (var i = 0; i < json.pins.length; i++) {
            pinDesc[0][i] = json.pins[i].lat;
            pinDesc[1][i] = json.pins[i].lng;
            pinDesc[2][i] = json.pins[i].desc;
        }
        // Create the map.
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 1,
            center: {lat: 0, lng: 0},
            mapTypeId: 'terrain'
        });
        // Construct the circle for each value in citymap.
        // Note: We scale the area of the circle based on the population.
        for (var i = 0; i < json.pins.length; i++) {
            // Add the circle for this city to the map.
            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: {lat: parseInt(pinDesc[0][i]), lng: parseInt(pinDesc[1][i])},
                radius: 1000000
            });
        }
    });
}