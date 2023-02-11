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
  return HtmlService.createHtmlOutputFromFile('index');
}

function getCategories() {
  return spreadsheet.getSheetByName('Categories').getDataRange().getValues();
}

function postData(date, category, amount, comment) {
  categories = getCategories();
  sheet = spreadsheet.getSheetByName(year);
  if (sheet == null) {
    sheet = spreadsheet.insertSheet(year);
    spreadsheet.setFrozenColumns(2);
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

  if (!foundMonthTable) {
    if (data.length > 1) {
      yOffset = data.length + 2;
    }

    // font & format
    sheet.getRange(yOffset, xOffset, categories.length + 2, 33)
         .setFontSize(10)
         .setFontFamily('Ubuntu')
         .setBorder(true, true, true, true, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(yOffset + 1, xOffset + 1, categories.length + 1, 32).setNumberFormat('#,##0.00');

    // header
    sheet.getRange(yOffset, xOffset, 1, 33).setBackground('#a8d1a8');
    sheet.getRange(yOffset, xOffset)
         .setFontWeight('bold')
         .setValue(month);
    sheet.getRange(yOffset, xOffset + 1).setValue('Total');
    for (var day = 1; day <= 31; day++) {
      sheet.getRange(yOffset, xOffset + 1 + day).setValue(day);
    }

    // categories
    for (var row = 0; row < categories.length; row++) {
      var currentYOffcet = yOffset + 1 + row;
      if (row % 2 != 0) {
        sheet.getRange(currentYOffcet, xOffset, 1, 33).setBackground('#dddada');
      }
      sheet.getRange(currentYOffcet, xOffset).setValue(categories[row]);
      sheet.getRange(currentYOffcet, xOffset + 1).setFormulaR1C1('=SUM(R[0]C[1]:R[0]C[31])');
    }

    // footer
    var currentYOffcet = yOffset + categories.length + 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 33)
         .setFontWeight('bold')
         .setBackground('#ffd966');
    sheet.getRange(currentYOffcet, xOffset).setValue('Total');
    for (var day = 0; day <= 31; day++) {
      sheet.getRange(currentYOffcet, xOffset + 1 + day).setFormulaR1C1(`=SUM(R[-${categories.length}]C[0]:R[-1]C[0])`);
    }

    // columns width
    sheet.setColumnWidth(1, 230);
    sheet.setColumnWidth(2, 65);
    sheet.setColumnWidths(3, 31, 65);
  }

  setAmount(yOffset, xOffset, category, amount, comment);
}

function setAmount(yOffset, xOffset, category, amount, comment) {
  if (amount != '') {
    amount = amount.replace(',', '.');
    var categoryIndex;
    for (var n = 0; n < categories.length; n++) {
      if (categories[n][0] == category) {
        categoryIndex = n;
        break;
      }
    }
    var cell = sheet.getRange(yOffset + 1 + categoryIndex, xOffset + 1 + day);
    if (cell.getValue() != '') {
      var currentValue = cell.getFormula() != '' ? cell.getFormula() : cell.getValue();
      cell.setValue(`=${currentValue}+${amount}`.replace('==', '='));
    } else {
      if (amount.includes('+') || amount.includes('-') || amount.includes('/') || amount.includes('*')) {
        cell.setValue(`=${amount}`);
      } else {
        cell.setValue(amount);
      }
    }
    if (comment != '') {
      cell.setComment(`${cell.getComment()}\n* ${comment}`);
    }
  }
}

function test() {
  postData('Arrendamento & serviços', '750/40.57', 'comment');
}
