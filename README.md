# bamazon_app
command line amazon app.

bamazonCustomer.js
    The user has a choice to make a purchase or to exit.  If they chose to make a purchase they can pick one item and how many they would like and the program will update the SQL database. After they chose the item and the quantity the program will tell them the total for what they spent.  If the item they chose does not have enough items then the program will notify the user and restart the program.

bamazonManager.js
    The user starts the program and is given 5 choices.

    View products for sale
        This choice will show all the items in the products database and all the information held within them.  Afterwards the program will restart.

    View Low Inventory
        This Choice will show all the items in the products table that have less than 5 items in the stock quantity.  Afterwards the program will restart.

    Add to Inventory
        This choice will allow to pick a item and add as many items to the inventory as they would like.  Afterwards the program will restart.

    Add New Product
        This choice will allow the user to add a completely new item to the database.  Afterwards the program will restart.

    Exit
        This choice will exit the program.