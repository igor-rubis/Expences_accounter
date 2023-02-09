var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
var date = new Date();
var year = date.getFullYear().toString();
var month = months[date.getMonth()];
var day = date.getDate();
var categories;
var sheet;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('files/index');
}

function getCategories() {
  return spreadsheet.getSheetByName('Categories').getDataRange().getValues();
}

function postData(category, amount, comment) {
  categories = getCategories();
  sheet = spreadsheet.getSheetByName(year);
  if (sheet == null) {
    sheet = spreadsheet.insertSheet(year);
  }

  var data = sheet.getDataRange().getValues();

  var yOffset = 1;
  var xOffset = 1;

  var foundMonthTable = false;

  if (data.length > 1) {
    for (var row = 0; row < data.length; row++) {
      if (data[row][0] == month) {
        yOffset = row + 1;
        foundMonthTable = true;
        break;
      }
    }
  }

  if (yOffset == 1 || !foundMonthTable) {
    if (data.length > 1) {
      yOffset = data.length + 2;
    }

    // header
    sheet.getRange(yOffset, xOffset).setValue(month);
    sheet.getRange(yOffset, xOffset + 1).setValue('Total');
    for (var day = 1; day <= 31; day++) {
      sheet.getRange(yOffset, xOffset + 1 + day).setValue(day);
    }

    // categories
    for (var row = 0; row < categories.length; row++) {
      var currentYOffcet = yOffset + 1 + row;
      sheet.getRange(currentYOffcet, xOffset).setValue(categories[row]);
      sheet.getRange(currentYOffcet, xOffset + 1).setValue('Formula `total sum of this line`');
    }

    // footer
    var currentYOffcet = yOffset + categories.length + 1;
    sheet.getRange(currentYOffcet, xOffset).setValue('Total');
    sheet.getRange(currentYOffcet, xOffset + 1).setValue('Formula `total sum of this column`');
    for (var day = 1; day <= 31; day++) {
      sheet.getRange(currentYOffcet, xOffset + 1 + day).setValue('Formula `total sum of this column`');
    }
  }

  setAmount(yOffset, xOffset, category, amount, comment);
}

function setAmount(yOffset, xOffset, category, amount, comment) {
  if (amount != '') {
    var categoryIndex;
    for (var n = 0; n < categories.length; n++) {
      if (categories[n][0] == category) {
        categoryIndex = n;
        break;
      }
    }
    var cell = sheet.getRange(yOffset + 1 + categoryIndex, xOffset + 1 + day);
    if (cell.getValue() != '') {
      var currentValue  = cell.getFormula() != '' ? cell.getFormula() : cell.getValue();
      cell.setValue( `=${currentValue}+${amount}`.replace('==', '='));
    } else {
      cell.setValue(amount);
    }
    if (comment != '') {
      cell.setComment(`${cell.getComment()}\n* ${comment}`);
    }
  }
}

function test() {
  postData('First', 1, 'comment');
}
