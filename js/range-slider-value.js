/**
 * Created by adam on 12/02/2017.
 */

/**
 * Updates the value of an input text field when the value in the input range slider changes.
 */
function updateTextInput(val) {
    document.getElementById('textInput').value = val;
}

/**
 * Updates the value of a h5 header when a new value in the select placeholder is chosen.
 */
function updateSelectedStock() {
    var stock = document.getElementById('stocks').value;
    document.getElementById('selected-stock').innerText = stock;
}

/**
 * Creates an alert when the button "buy" is clicked.
 */
function buttonBuyStock() {
    alert("Stock purchased");
}