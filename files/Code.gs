var categories = [
  'First',
  'Second' // fill this array with your favourite categories
];
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
  return categories;
}

function postData(category, amount) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = spreadsheet.getSheetByName(year);
  if(sheet == null) {
    sheet = spreadsheet.insertSheet(year);
  }
  
  var data = sheet.getDataRange().getValues();
  
  var monthTableHeight = categories.length + 4;
  
  var anchorCellXOffset = 0;
  var anchorCellYOffset = null;
  for(var row = 0; row < data.length; row + monthTableHeight) {
    if(data[row][0] == month) {
      anchorCellYOffset = row;
      break;
    }
  }
  
  if(anchorCellYOffset == null) {
    createMonthTable();
    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  } else {
    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  }
}

function createMonthTable() {
  
}

function setAmount(anchorCellXOffset, anchorCellYOffset, category, amount) {
  
}