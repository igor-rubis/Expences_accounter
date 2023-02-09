var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var date = new Date();
var year = date.getFullYear().toString();
var month = months[date.getMonth()];
var day = date.getDate();

function doGet() {
    return HtmlService.createHtmlOutputFromFile("files/index");
}

function getCategories() {
    return spreadsheet.getSheetByName('Categories').getDataRange().getValues();
}

function postData(category, amount, comment) {
    var categories = getCategories();
    var categoriesLength = categories.length;
    var sheet = spreadsheet.getSheetByName(year);
    if (sheet == null) {
        sheet = spreadsheet.insertSheet(year);
    }

    var data = sheet.getDataRange().getValues();

    var yOffset = 1;
    var xOffset = 1;

    var foundMonthTable = false;

    if (data.length > 1) {
        for (var row = 1; row < data.length; row + categoriesLength + 4) {
            if (data[row][0] == month) {
                yOffset = row;
                foundMonthTable = true;
                break;
            }
        }
    }

    if (yOffset == 1 || !foundMonthTable) {
        if (data.length > 1) {
            yOffset = data.length + 2;
        }

        sheet.getRange(yOffset, xOffset).setValue(month);
        sheet.getRange(yOffset + 1, xOffset + 1).setValue('Total');
        sheet.getRange(yOffset + categoriesLength + 2, xOffset).setValue('Total');
        for (var row = 0; row < categoriesLength; row++) {
            sheet.getRange(yOffset + 2 + row, xOffset).setValue(categories[row]);
        }

        setAmount(yOffset, xOffset, category, amount, comment);
    } else {
        setAmount(yOffset, xOffset, category, amount, comment);
    }
}

function setAmount(yOffset, xOffset, category, amount, comment) {

}
