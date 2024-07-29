// Fetch id from HTML (modal)
var modal = document.getElementById('modal-id');

// Load modal when website loads
window.onload = (event) => {
    modal.style.display = "block";
};

// User clicks anywhere on the screen = closes modal display
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Modal display "closes"
    }
}

// MODAL ^^^

// Adding markers to map from Google Form
function addMarker(data) {
    let lng = data['lng'];
    let lat = data['lat'];
    let commuterStatus = data['Do you currently identify as a UCLA commuter student?'];
    let mealPrepStatus = data['Do you meal prep ahead of time to prepare for a day on-campus?'];
    let mealPrepReason = data['Expand on your answer above?'];
    let fridgeAccess = data[''];
    let microwaveAccess = data[''];
    let experience = data[''];

    let popup_message; 
    if ( == "Yes") {

    }
}


// declare variables
let mapOptions = {'centerLngLat': [-118.444,34.0709],'startingZoomLevel':8}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/bright/style.json?key=JWrMVIrr3Jz2WGVMeDwh', // Your style URL
    center: mapOptions.centerLngLat, // Starting position [lng, lat]
    zoom: mapOptions.startingZoomLevel // Starting zoom level
});

