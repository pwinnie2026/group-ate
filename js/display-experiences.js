// URL of Google Sheets from responses
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJWr_UjcZ-8GWHZr-9nsnwY9BJKCLE3k3X6IIyjta5b-ZpXxUGr8pZPK7H43cVYfcj_PGjKpiC7nQ2/pub?output=csv"

// Function for fetching and parsing CSV data
function loadData (){
 Papa.parse(dataURL, {
    download: true,
    header: true,
    complete: function(results) {
        displayData(results.data)
    }
 });
}

// Function for displaying data on page
function displayExperience(data) {
    const experience = document.getElementById('experiences-container');
    experience.innerHTML = ''; 

    // Looping through each row of data
    data.forEach(row => {
        const response = row['Expand on your experiences using refrigeration (storage) and microwave (reheating) on campus, if any'];

        if (response) {
            const div = document.createElement('div');
            div.classList.add('response');
            div.innerHTML = `
            <p><strong>Experience</strong></p>
            <p><p>${response}</p>  
            `;
            container.appendChild(div);
        }
    });
}

// Load data when the page loads
window.onload = loadData;