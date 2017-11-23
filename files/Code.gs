function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function getCategories() {
  var categories = [
        'First',
        'Second'
    ];
  
  return categories;
}

function postData(category, amount) {
  Logger.log(category);
  Logger.log(amount);
}
