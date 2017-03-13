/**
 * Created by adam on 12/02/2017.
 */

/**
 * Updates the value of an input text field when the value in the input range slider changes.
 */
function updateTextInput(val) {
    document.getElementById('textInput').value = val;
}

function updatePrice() {
    var price = document.getElementById('slider').value;
    document.getElementById('textInput').innerText = "£" + price;
}

/**
 * Updates the value of a h5 header when a new value in the select placeholder is chosen.
 */
function updateSelectedStock() {
    var stockSelected = document.getElementById('stocks').value;
    document.getElementById('selected-stock').innerText = stockSelected;
}

/**
 * Updates the value of a h5 header when a new value in the select placeholder is chosen.
 */
function updateSelectedRecommendedStock() {
    var stockRecommended = document.getElementById('stocks-recommended').value;
    document.getElementById('selected-stock').innerText = stockRecommended;
}

/**
 * Creates an alert when the button "buy" is clicked.
 */
function buttonBuyStock() {
    alert("Stock purchased");
}