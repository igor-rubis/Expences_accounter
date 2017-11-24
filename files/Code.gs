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

  var anchorCellXOffset = 1;
  var anchorCellYOffset = 1;

  if (data.length > 1) {
    for(var row = 1; row < data.length; row + getCategories().length + 4) {
      if(data[row][0] == month) {
        anchorCellYOffset = row;
        break;
      }
    }
  }

  if (anchorCellYOffset == 1) {
    if (data.length > 1) {
      anchorCellYOffset = data.length + 2;
    }

    sheet.getRange(anchorCellXOffset, anchorCellYOffset).setValue(month);
    sheet.getRange(anchorCellXOffset + 1, anchorCellYOffset + 1).setValue('Total');
    sheet.getRange(anchorCellXOffset + getCategories().length + 2, anchorCellYOffset).setValue('Total');


    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  } else {
    setAmount(anchorCellXOffset, anchorCellYOffset, category, amount);
  }
}

function setAmount(anchorCellXOffset, anchorCellYOffset, category, amount) {
  
}