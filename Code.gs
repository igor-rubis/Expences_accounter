function test() {
  // setAmount(15, 15, 'Arrendamento & serviços', 100, "comment")
  postData('2024-01-01', 'Arrendamento & serviços', '111', 'UAH', 'comment');
  // postData('2023-07-14', 'Income', '111', 'bbb');
  console.log();
}

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
let categories;
let sheet;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function getCurrencies() {
  let name = 'Currencies';
  let categoriesSheet = spreadsheet.getSheetByName(name);
  if (categoriesSheet == null) {
    console.log(`Creating ${name} sheet`)
    categoriesSheet = spreadsheet.insertSheet(name);
    categoriesSheet.getRange('A2').setValue('USD');
    categoriesSheet.getRange('A3').setValue('UAH');
  }
  let dateCell = categoriesSheet.getRange('B1');
  let usdRateCell = categoriesSheet.getRange('B2');
  let uahRateCell = categoriesSheet.getRange('B3');
  if (
    Utilities.formatDate(dateCell.getValue(), 'GMT+2', 'dd/MM/yyyy') != Utilities.formatDate(new Date(), 'GMT+2', 'dd/MM/yyyy')
    || usdRateCell.getValue() == ''
    || uahRateCell.getValue() == ''
  ) {
    dateCell.setValue(Utilities.formatDate(new Date(), 'GMT+2', 'dd/MM/yyyy'));
    console.log('connecting to monobank api')
    const currencyIdEur = 978;
    const currencyIdUsd = 840;
    const currencyIdUah = 980;
    let rates = JSON.parse(UrlFetchApp.fetch('https://api.monobank.ua/bank/currency').getContentText());
    let rateUsdSet = false;
    let rateUahSet = false;
    for (let i = 0; i < rates.length; i++) {
      if (rateUsdSet && rateUahSet) {
        break;
      }
      let rate = rates[i];
      if (rate.currencyCodeA == currencyIdEur) {
        if (rate.currencyCodeB == currencyIdUsd) {
          console.log(`USD rate: ${rate.rateSell}`)
          usdRateCell.setValue(rate.rateSell);
          rateUsdSet = true;
        }
        if (rate.currencyCodeB == currencyIdUah) {
          console.log(`UAH rate: ${rate.rateSell}`)
          uahRateCell.setValue(rate.rateSell);
          rateUahSet = true;
        }
      }
    }
  }
  return categoriesSheet.getDataRange().getValues();
}

function getCategories() {
  let name = 'Categories';
  let categoriesSheet = spreadsheet.getSheetByName(name);
  if (categoriesSheet == null) {
    categoriesSheet = spreadsheet.insertSheet(name);
  }
  return categoriesSheet.getDataRange().getValues();
}

// function postData(date, category, amount, currency, comment, subcategory) {
function postData(date, category, amount, currency, comment) {
  console.log(`running: postData`);
  console.log(`date: ${date}`);
  console.log(`category: ${category}`);
  console.log(`amount: ${amount}`);
  console.log(` currency: ${currency}`);
  console.log(` comment: ${comment}`);
  categories = getCategories().map(function (arr) {return arr[0];});
  var today = date == '' ? new Date() : new Date(date);
  var day = today.getDate();
  console.log(`day: ${day}`);
  var month = months[today.getMonth()];
  console.log(`month: ${month}`);
  var year = today.getFullYear().toString();
  console.log(`year: ${year}`);

  sheet = spreadsheet.getSheetByName(year);
  if (sheet == null) {
    sheet = spreadsheet.insertSheet(year);
    spreadsheet.setFrozenColumns(2);
    sheet.insertColumnsAfter(26, 7);
    sheet.setColumnWidth(1, 230);
    sheet.setColumnWidth(2, 65);
    sheet.setColumnWidths(3, 31, 65);
  }

  var yOffset = 1;
  var xOffset = 1;

  console.log('create `Average` table');
  if (sheet.getDataRange().getValues().length <= 1) {
    // font & format
    sheet.getRange(yOffset, xOffset, categories.length + 3, 3)
         .setFontSize(10)
         .setFontFamily('Ubuntu')
         .setBorder(true, true, true, true, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(yOffset + categories.length + 3, xOffset, 1, 3)
         .setFontSize(10)
         .setFontFamily('Ubuntu')
         .setBorder(true, true, true, true, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(yOffset + 1, xOffset + 1, categories.length + 3, 2).setNumberFormat('#,##0.00');

    // header
    sheet.getRange(yOffset, xOffset, 1, 3).setBackground('#a8d1a8');
    sheet.getRange(yOffset, xOffset + 1)
         .setFontWeight('bold')
         .setValue('Average');
    sheet.getRange(yOffset, xOffset + 2)
         .setFontWeight('bold')
         .setValue('Totals');

    // categories
    sheet.getRange(yOffset + 1, xOffset, categories.length, 3).setBackgrounds(
      [...new Array(categories.length)].map((_, i) => i % 2 != 0 ? [...new Array(3)].map(() => '#dddada') : [...new Array(3)].map(() => '#ffffff'))
    );
    sheet.getRange(yOffset + 1, xOffset, categories.length, 1).setValues(
      [...new Array(categories.length)].map((_, i) => [categories[i]])
    );

    // Total
    var currentYOffcet = yOffset + categories.length + 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 3)
         .setFontWeight('bold')
         .setBackground('#ffd966');
    sheet.getRange(currentYOffcet, xOffset).setValue('Total');
    sheet.getRange(currentYOffcet, xOffset + 1, 1, 2).setFormulasR1C1([[...new Array(2)].map(() => `=SUM(R[-${categories.length}]C[0]:R[-1]C[0])`)]);

    // Income
    currentYOffcet += 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 3)
         .setFontWeight('bold')
         .setBackground('#d5a6bd');
    sheet.getRange(currentYOffcet, xOffset).setValue('Income');

    // Margin
    currentYOffcet += 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 3)
         .setFontWeight('bold')
         .setBackground('#ff9900');
    sheet.getRange(currentYOffcet, xOffset).setValue('Margin');
    sheet.getRange(currentYOffcet, xOffset + 1, 1, 2).setFormulasR1C1([[...new Array(2)].map(() => '=R[-1]C[0]-R[-2]C[0]')]);
  }

  var foundMonthTable = false;
  var data = sheet.getDataRange().getValues();
  for (var row = 0; row < data.length; row++) {
    if (data[row][0] == month) {
      yOffset = row + 1;
      foundMonthTable = true;
      break;
    }
  }

  if (!foundMonthTable) {
    console.log(`Month table does not exist. Creating new for: ${month}`);
    yOffset = data.length + 2;

    // font & format
    sheet.getRange(yOffset, xOffset, categories.length + 3, 33)
         .setFontSize(10)
         .setFontFamily('Ubuntu')
         .setBorder(true, true, true, true, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(yOffset + categories.length + 3, xOffset, 1, 2)
         .setFontSize(10)
         .setFontFamily('Ubuntu')
         .setBorder(true, true, true, true, true, true, 'black', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(yOffset + 1, xOffset + 1, categories.length + 3, 32).setNumberFormat('#,##0.00');

    // header
    sheet.getRange(yOffset, xOffset, 1, 33).setBackground('#a8d1a8');
    sheet.getRange(yOffset, xOffset)
         .setFontWeight('bold')
         .setValue(month);
    sheet.getRange(yOffset, xOffset + 1).setValue('Total');
    sheet.getRange(yOffset, xOffset + 2, 1, 31).setValues([[...new Array(31)].map((_, i) => i + 1)]);

    // categories
    sheet.getRange(yOffset + 1, xOffset, categories.length, 33).setBackgrounds(
      [...new Array(categories.length)].map((_, i) => i % 2 != 0 ? [...new Array(33)].map(() => '#dddada') : [...new Array(33)].map(() => '#ffffff'))
    );
    sheet.getRange(yOffset + 1, xOffset, categories.length, 1).setValues(
      [...new Array(categories.length)].map((_, i) => [categories[i]])
    );
    sheet.getRange(yOffset + 1, xOffset + 1, categories.length, 1).setFormulasR1C1(
      [...new Array(categories.length)].map(() => ['=SUM(R[0]C[1]:R[0]C[31])'])
    );

    // Total
    var currentYOffcet = yOffset + categories.length + 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 33)
         .setFontWeight('bold')
         .setBackground('#ffd966');
    sheet.getRange(currentYOffcet, xOffset).setValue('Total');
    sheet.getRange(currentYOffcet, xOffset + 1, 1, 32).setFormulasR1C1([[...new Array(32)].map(() => `=SUM(R[-${categories.length}]C[0]:R[-1]C[0])`)]);

    // Income
    currentYOffcet += 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 33)
         .setFontWeight('bold')
         .setBackground('#d5a6bd');
    sheet.getRange(currentYOffcet, xOffset).setValue('Income');
    sheet.getRange(currentYOffcet, xOffset + 1).setFormulaR1C1('=SUM(R[0]C[1]:R[0]C[31])');

    // Margin
    currentYOffcet += 1;
    sheet.getRange(currentYOffcet, xOffset, 1, 2)
         .setFontWeight('bold')
         .setBackground('#ff9900');
    sheet.getRange(currentYOffcet, xOffset).setValue('Margin');
    sheet.getRange(currentYOffcet, xOffset + 1).setFormulaR1C1('=R[-1]C[0]-R[-2]C[0]');

    setAverages();
  }

  setAmount(yOffset, xOffset + 1 + day, category, amount, currency, comment);
}

function setAverages() {
  console.log('Setting averages');
  var currentYOffset = 2;
  var data = sheet.getDataRange().getValues();

  console.log('Looking for categories in `averages`:');
  var categoriesAverage = [];
  var startRow = 1;
  while (true) {
    var value = data[startRow][0];
    if (value == 'Margin') break;
    if (value != 'Total') categoriesAverage.push(value);
    startRow++;
  }
  console.log(`categoriesAverage:\n  ${categoriesAverage.join('\n  ')}`);

  for (var row = 0; row < categoriesAverage.length; row++) {
    var categoryOccurrence = 0;
    var indexes = [];
    var currentCategory = categoriesAverage[row];
    for (var rowToSearchCategory = currentYOffset + row + 1; rowToSearchCategory < data.length; rowToSearchCategory++) {
      if (data[rowToSearchCategory][0] == currentCategory) {
        categoryOccurrence += 1;
        if (currentCategory == 'Income') {
          indexes.push(rowToSearchCategory - row - 2);
        } else {
          indexes.push(rowToSearchCategory - row - 1);
        }
      }
    }
    if (currentCategory == 'Income') currentYOffset++;
    var averagesCell = sheet.getRange(currentYOffset + row, 2);
    averagesCell.clearContent();
    averagesCell.setFormulaR1C1(`=(R[${indexes.join(']C[0]+R[')}]C[0])/${new Date().getMonth() + 1}`);
    var totalsCell = sheet.getRange(currentYOffset + row, 3);
    totalsCell.clearContent();
    totalsCell.setFormulaR1C1(`=R[${indexes.join(']C[-1]+R[')}]C[-1]`);
  }
}

function getCategoryIndex(category) {
  for (var n = 0; n < categories.length; n++) {
    if (categories[n] == category) return n;
  }
}

function setAmount(yOffset, xOffset, category, amount, currency, comment) {
  console.log(`running: setAmount(yOffset: ${yOffset}, xOffset: ${xOffset}, category: ${category}, amount: ${amount}, comment: ${comment})`);
  if (amount != '') {
    amount = amount.toString().replace(',', '.');
    let amountComment = `${amount} ${currency}`;
    if (currency != 'EUR') {
      console.log(`getting today's currency rate for: ${currency}`);
      let currencies = new Map();
      let currenciesData = getCurrencies();
      for (var i = 0; i < currenciesData.length; i++) {
        currencies.set(currenciesData[i][0], currenciesData[i][1]);
      }
      amount = `${amount}/${currencies.get(currency)}`;
      amountComment += ` (${eval(amount).toFixed(2)} EUR)`;
    }
    let categoryIndex = category == 'Income' ? categories.length + 1 : getCategoryIndex(category);
    console.log(`getting row to set amount: yOffset: ${yOffset + 1 + categoryIndex}, xOffset: ${xOffset}`);
    let cell = sheet.getRange(yOffset + 1 + categoryIndex, xOffset);
    if (cell.getValue() != '') {
      let currentValue = cell.getFormula() != '' ? cell.getFormula() : cell.getValue();
      cell.setValue(`=${currentValue}+${amount}`.replace('==', '='));
    } else {
      cell.setValue((amount.includes('+') || amount.includes('-') || amount.includes('/') || amount.includes('*')) ? `=${amount}` : amount);
    }
    cell.setComment(`${cell.getComment()}\n* ${amountComment}: ${comment}`.trim());
  }
}
