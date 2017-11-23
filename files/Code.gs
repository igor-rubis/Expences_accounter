var date = new Date();
var months = new Array();
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

var sheet;

function doGet() {
    return HtmlService.createHtmlOutputFromFile("files/index");
}

function getCategories() {
    var categories = [
        'First',
        'Second'
    ];
  
    return categories;
}

function postData(category, amount) {
    var month = months[date.getMonth()];
    var day = date.getDate();
    getSheet();
}

function getSheet() {
    var year = date.getFullYear().toString();
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    sheet = spreadsheet.getSheetByName(year);
    if(sheet == null) {
      sheet = spreadsheet.insertSheet(year);
    }
}