// MODAL  

// Fetch id from HTML (modal)
var modal = document.getElementById('modal-id');

// // Load modal when website loads
// window.onload = (event) => {
//     modal.style.display = "block";
// };

// User clicks anywhere on the screen = closes modal display
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Modal display "closes"
    }
}

// MAP
// declare variables
let mapOptions = { 'centerLngLat': [-118.444, 34.0709], 'startingZoomLevel': 8 }

// this is to retrieve all of the data when we need it
let allData = [];

// this is to store data by category
let categorizedData = [];


const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/bright/style.json?key=JWrMVIrr3Jz2WGVMeDwh', // Your style URL
    center: mapOptions.centerLngLat, // Starting position [lng, lat]
    zoom: mapOptions.startingZoomLevel // Starting zoom level
});

// Adding markers to map from Google Form
function addMarker(data) {

    //Assinging variables to each survey question
    let lng = parseFloat(data['lng']);
    let lat = parseFloat(data['lat']);
    let commuterStatus = data['Do you currently identify as a UCLA commuter student?'];
    let zipCode = data['What is the zipcode of the area you commute from?'];
    let mealPrepStatus = data['Do you meal prep ahead of time to prepare for a day on campus?'];
    let mealPrepReason = data['Expand on your answer above'];
    let fridgeAccess = data['Do you feel you have enough access to fridges for storing meals on campus? '];
    let microwaveAccess = data['Do you feel you have enough access to microwaves for reheating meals on campus?'];
    let experience = data['Expand on your experiences using refrigeration (storage) and microwave (reheating) on campus, if any'];

    let popup_message;

    // Adding marker only if student is a commuter student
    if (commuterStatus == "Yes") {
        
        // Separate markers by zipcode
        // Insert code here

        popup_message = `Zipcode: ` + zipCode + `<br><br>`;

        // Add experience at the top to emphasize

        popup_message += `<span style="color: red;"><strong>Student experience:</strong> ` + experience + `</span><br><br>`;

        // Information pulled from question 3 and 4 of survey for popup message of marker
        if (mealPrepStatus == "Yes") {
            popup_message += `Does meal prep <br>`;
            popup_message += `Meal prep storage location: ` + mealPrepReason + `<br>`;
        } else if (mealPrepStatus == "No") {
            popup_message += `Does not meal prep <br>`;
            popup_message += `Reason for not meal prepping: ` + mealPrepReason + `<br>`;
        }

        // Information pulled from questions 5 and 6 of survey for color of marker
        let img; 
        if (fridgeAccess.includes('Yes')) {
            if (microwaveAccess.includes('Yes')) {
                img = 'whiteMarker';
            } else if(microwaveAccess.includes("No")) {
                img = 'lightRedMarker';
            }
        } else if (fridgeAccess.includes("No")) {
            if (microwaveAccess.includes("Yes")) {
                img = 'lightRedMarker';
            } else if (microwaveAccess.includes("No"))
                img = 'redMarker';
        }
    let offsetModification = 50;
    const [modifiedLongitude, modifiedLatitude] = PointManager.addPointData(lng, lat, offsetModification);
    let marker = new maplibregl.Marker({
         element: createMarkerElement(img)
    })
        .setLngLat([modifiedLongitude, modifiedLatitude])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    // Add event listeners to the popup
   //marker.getPopup().on('open', () => {
        //let experiencesContainer = document.getElementById('experiences-container');
        //experiencesContainer.innerHTML = experience;
        //experiencesContainer.style.display = 'block';
        //experiencesContainer.classList.add('slide-in');
        //experiencesContainer.classList.remove('slide-out');
    //});

    //marker.getPopup().on('close', () => {
        //let experiencesContainer = document.getElementById('experiences-container');
        //experiencesContainer.classList.add('slide-out');
        //experiencesContainer.classList.remove('slide-in');
        //setTimeout(() => {
            //experiencesContainer.style.display = 'none';
        //}, 300); // Assuming the slide-out animation duration is 300ms
    //});
  //}
    }

}

// Create custom markers
function createMarkerElement(img) {
    const markerImg = `markerTagPhotos/${img}.png`;
    const marker = document.createElement('div');
    marker.style.backgroundImage = `url(${markerImg})`;
    marker.style.width = "40px";
    marker.style.height = "80px";
    marker.style.borderRadius = '50px';
    marker.style.backgroundSize = 'contain';
    marker.style.backgroundRepeat = 'no-repeat';
    marker.style.backgroundPosition = 'center';

    console.log(`Created marker element with image ${markerImg}`);

    return marker;
 }

 function getCategoryClass(img) {
    switch(img) {
        case 'whiteMarker': return 'marker-whiteMarker';
        case 'lightRedMarker': return 'marker-lightRedMarker';
        case 'redMarker': return 'marker-redMarker';
        default: return '';
    }
}


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJWr_UjcZ-8GWHZr-9nsnwY9BJKCLE3k3X6IIyjta5b-ZpXxUGr8pZPK7H43cVYfcj_PGjKpiC7nQ2/pub?output=csv"

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function () {
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: function (results) {
            // Process the parsed data
            processData(results.data); // Use a new function to handle CSV data
            summarizeCategorizedData();
            addToHtmlCategoryData()
        }
    });

});

//     /\_____/\
//    /  o   o  \   <---I AM A setData-CAT-EGORY function😿😿😿😿
//   ( ==  ^  == )
//    )         (
//   (           )
//  ( (  )   (  ) )
// (__(__)___(__)__)

function setDataCategory(feature) {
    // categorize data to store based on satisfied, somewhat, and unsatisfied
    let fridgeAccess = feature['Do you feel you have enough access to fridges for storing meals on campus? '];
    let microwaveAccess = feature['Do you feel you have enough access to microwaves for reheating meals on campus?'];
    let thisCategory;
    if (fridgeAccess == "Yes" && microwaveAccess == "Yes") {
        thisCategory = "satisfied";
    }
    else if (fridgeAccess == "No" && microwaveAccess == "No")
        {
        thisCategory = "unsatisfied";
    }
    else {
        thisCategory = "somewhat"
    }
    return thisCategory;
}


function processData(results) {
    console.log(results) //for debugging: this can help us see if the results are what we want
    results.forEach(feature => {
        console.log(feature) // for debugging: are we seeing each feature correctly?
        // assumes your geojson has a "title" and "message" attribute
        // let coordinates = feature.geometry.coordinates;
        let newFeature = {};
        let longitude = feature['lng'];
        let latitude = feature['lat'];
        let commuterStatus = feature['Do you currently identify as a UCLA commuter student?'];
        let zipCode = feature['What is the zipcode of the area you commute from?'];
        let mealPrepStatus = feature['Do you meal prep ahead of time to prepare for a day on campus?'];
        let mealPrepReason = feature['Expand on your answer above'];
        let fridgeAccess = feature['Do you feel you have enough access to fridges for storing meals on campus? '];
        let microwaveAccess = feature['Do you feel you have enough access to microwaves for reheating meals on campus?'];
        let experience = feature['Expand on your experiences using refrigeration (storage) and microwave (reheating) on campus, if any'];
        let satificationCategory = setDataCategory(feature);        
        newFeature['lng'] = longitude;
        newFeature['lat'] = latitude;
        newFeature['commuterStatus'] = commuterStatus;
        newFeature['zipcode'] = zipCode;
        newFeature['mealPrepStatus'] = mealPrepStatus;
        newFeature['mealPrepReason'] = mealPrepReason;
        newFeature['fridgeAccess'] = fridgeAccess;
        newFeature['microwaveAccess'] = microwaveAccess;
        newFeature['experience'] = experience;
        newFeature['satificationCategory'] = satificationCategory;
        console.log(satificationCategory);
        allData.push(newFeature);
        addMarker(feature);
    });
};

// summary counter for category tabs
function summarizeCategorizedData(){
    let satisfied = 0;
    let somewhat = 0;
    let unsatisfied = 0;
    console.log('allData')
    console.log(allData)
    allData.forEach(feature=>{
        if(feature.satificationCategory == "satisfied"){
            satisfied += 1;
        }
        else if(feature.satificationCategory == "somewhat"){
            somewhat += 1;
        }
        else{
            unsatisfied += 1;
        }
    })

    let satisifiedCategory = {"category":"satisfied", "count":satisfied};
    let somewhatCategory = {"category":"somewhat", "count":somewhat};
    let unsatisfiedCategory = {"category":"unsatisfied", "count":unsatisfied};
    console.log('satisifiedCategory');
    console.log(satisifiedCategory);
    categorizedData.push(satisifiedCategory);
    categorizedData.push(somewhatCategory);
    categorizedData.push(unsatisfiedCategory);

}

const categoryMap = {
    'stasified': 'marker-whiteMarker',
    'somewhat': 'marker-lightRedMarker',
    'unstaisfied': 'marker-redMarker'
};

// Function to filter data based on cateogry selection 
export function filterData(event, category){

    console.log(`Filtering by cateogry: ${category}`);
    //let filteredData = allData.filter(feature=>feature.satificationCategory === category);
    console.log(filterData);
    // map.getSource('markers').setData(filteredData);
    toggleMarkersVisibility(category, true);
    console.log('hi you clicked the '+category+' buttton')
}

window.filterData = filterData;

function toggleMarkersVisibility(category) {
    document.querySelectorAll(`.marker`).forEach(marker => {
        marker.style.display = 'none';
    });

    // Corresponding class from mapping object
    const className = categoryMap[category];
    if (className) {

        document.querySelectorAll(`.${className}`).forEach(marker => {
            marker.style.display = '';
        });
    }
}


function addToHtmlCategoryData(){
    let satisfiedTab = document.getElementById("tab-satisfied");
    satisfiedTab.innerHTML = "Satisfied: " + categorizedData[0].count;
    let somewhatTab = document.getElementById("tab-somewhat");
    somewhatTab.innerHTML = "Somewhat: " + categorizedData[1].count;
    let unsatisfiedTab = document.getElementById("tab-unsatisfied");
    unsatisfiedTab.innerHTML = "Unsatisfied: " + categorizedData[2].count;
    let targetDiv = document.getElementById("categorystuff");
    let htmlString = "";
    // categorizedData.forEach(category=>{
    //     let thisTab = document.getElementById(`tab-${category.category}`);
    //     thisTab.innerHTML = `${category.category}: ${category.count}`;
    // })
    
}