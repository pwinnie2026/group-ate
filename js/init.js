// MODAL
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