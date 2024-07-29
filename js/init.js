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

    //Assinging variables to each survey question
    let lng = data['lng'];
    let lat = data['lat'];
    let commuterStatus = data['Do you currently identify as a UCLA commuter student?'];
    let zipCode = data['What is the zip code of the area you commute from?']; 
    let mealPrepStatus = data['Do you meal prep ahead of time to prepare for a day on-campus?'];
    let mealPrepReason = data['Expand on your answer above?'];
    let fridgeAccess = data['Do you feel you have enough access to fridges for storing meals on-campus?'];
    let microwaveAccess = data['Do you feel you have enough access to microwaves for reheating meals on-campus?'];
    let experience = data['Expand on your experiences using refrigeration (storage) and microwave (reheating) on campus?'];

    let popup_message; 

    // Adding marker only if student is a commuter student
    if (commuterStatus == "Yes") {
        popup_message = `Zipcode: ` + zipCode + `<br>`; 

        // Information pulled from question 3 and 4 of survey for popup message of marker
        if (mealPrepStatus == "Yes") {
            popup_message += `Does meal prep <br>`; 
            popup_message += `Meal prep storage location: ` + mealPrepReason + `<br>`;
        } else if (mealPrepStatus == "No") {
            popup_message += `Does not meal prep <br>`; 
            popup_message += `Reason for not meal prepping: ` + mealPrepReason + `<br>`; 
        }

        // Information pulled from questions 5 and 6 of survey for popup message of marker
        if (fridgeAccess == "Yes") {
            popup_message += `Does have access to a fridge on campus <br>`;
        } else if (fridgeAccess == "No") {
            popup_message += `Does not have access to a fridge on campus <br>`;
        }

        if (microwaveAccess == "Yes") {
            popup_message += `Does have access to a microwave on campus <br><br>`;
        } else if (microwaveAccess == "No") {
            popup_message += `Does not have access to a microwave on campus <br><br>`;
        }

        popup_message += `Experience with on-campus food storage and reheating facilities: ` + experience; 

        let marker = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new maplibregl.Popup()
                .setHTML(popup_message))
            .addTo(map)
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

