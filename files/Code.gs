var date = new Date();
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