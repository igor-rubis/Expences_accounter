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

function postData(category, amount) {
  var sheet = spreadsheet.getSheetByName(year);
  if(sheet == null) {
    sheet = spreadsheet.insertSheet(year);
  }

  var data = sheet.getDataRange().getValues();
  Logger.log('data: ' + data);
  Logger.log('data.length: ' + data.length);

  var monthTableHeight = getCategories().length + 4;
  Logger.log('monthTableHeight: ' + monthTableHeight);

  var anchorCellXOffset = 0;
  var anchorCellYOffset = 0;

  if (data.length > 0) {
    for(var row = 0; row < data.length; row + monthTableHeight) {
      if(data[row][0] == month) {
        anchorCellYOffset = row;
        break;
      }
    }
  }
  Logger.log('anchorCellXOffset: ' + anchorCellXOffset);
  Logger.log('anchorCellYOffset: ' + anchorCellYOffset);

  if (anchorCellYOffset == 0) {
    if (data.length > 0) {
      anchorCellYOffset = data.length + 2;
    }

    sheet.getRange(anchorCellXOffset, anchorCellYOffset).setValue(month);


    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  } else {
    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  }
}

function setAmount(anchorCellXOffset, anchorCellYOffset, category, amount) {
  
}