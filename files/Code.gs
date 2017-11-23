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
    "December",
  ]

  var date = new Date();
  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var day = date.getDate();
}
