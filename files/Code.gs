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
  Logger.log(category);
  Logger.log(amount);
}
