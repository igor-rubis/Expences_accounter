# Expences_accounter

### Installation instructions

* Create google sheet
* Create a tab 'Categories'
* Populate it with your expences categories ![](screenshots/img_1.png)
* Go to `Extensions` -> `Apps script` ![](screenshots/img_2.png)
* Create files `Code.gs` and `index.html` ![](screenshots/img_3.png)
* Paste contents of corresponding files from this project
* Click `Deploy` -> `New deployment` ![](screenshots/img_4.png)
* Select type `Web app` ![](screenshots/img_5.png)
* Set:
    * `Execute as`: `Me`
    * `Who can access`: `Only myself` ![](screenshots/img_6.png)
* Deploy the app and authorize
  ![](screenshots/img_7.png) ![](screenshots/img_8.png) ![](screenshots/img_9.png) ![](screenshots/img_10.png)
* Use provided URL ![](screenshots/img_11.png)
* Confirm access of this project to your google drive:
![img.png](screenshots/img_12.png)
![img.png](screenshots/img_13.png)
![img.png](screenshots/img_14.png)

In some cases it takes time for the script to start working properly: https://support.google.com/docs/thread/99474963

### TODO

* Use case 'a category is added':
  * insert row with new category
  * add `total` formula for this row
  * assure all other formulas consider new row
  * redraw backgrounds for categories rows
* Use case a category is removed
