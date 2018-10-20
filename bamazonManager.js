var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Ch@rl3y1",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      
    startApp();
    }
  });

  function startApp() {
    inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View products for sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function(response) {
        var choice = response.choice;

        switch (choice) {
            case "View products for sale":
              forSale();
              break;
          case "View Low Inventory":
              lowInventory();
              break;
          case "Add to Inventory":
              addInventory();
              break;
          case "Add New Product":
              addItem();
              break;
          case "Exit":
              connection.end();
              break;
        };
    })
  };


  function forSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("--------------------");

          for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + parseFloat(res[i].price).toFixed(2) + " | " + res[i].stock_quantity);
            console.log("--------------------");
          }
          startApp();

        }
      } );
  };

  function lowInventory() {
      
      
      connection.query("SELECT * FROM products WHERE stock_quantity < 6", function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("--------------------");

          for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + parseFloat(res[i].price).toFixed(2) + " | " + res[i].stock_quantity);
            console.log("--------------------");
          }
          startApp();

        }
      } );
  };

  function addInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) {
            console.log(err);
            } else {
                console.log("--------------------");

                for (let i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + " | " + res[i].product_name + " | $" + parseFloat(res[i].price).toFixed(2) + " | " + res[i].stock_quantity);
                    console.log("--------------------");
                }
                    inquirer.prompt([{
                        name: "id",
                        message: "Chose the id of the item you would like to change",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                              return true;
                            }
                            return false;
                          }
                    },
                    {
                        name: "count",
                        message: "How many would you like to add",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                              return true;
                            }
                            return false;
                          }
                    }]).then(function(response) {
                        var ID = response.id;
                        connection.query("SELECT * FROM products WHERE item_id = ?", [response.id], function(err, result) {

                                if(err) {
                                    console.log(err);
                                } else {
                                    var newQuantity = parseFloat(result[0].stock_quantity) + parseFloat(response.count);
                                    
                                    connection.query("UPDATE products SET ? WHERE ?", [
                                        {
                                            stock_quantity: newQuantity
                                        },
                                        {
                                            item_id: ID
                                        }
                                    ], function (err, response) {
                                        if(err){
                                            console.log(err);
                                        }else {
                                            console.log(response.affectedRows + " updated!");
                                            startApp();
                                        }
                                            
                                    
                                    })
                                }
                        });
                        
                
                    });

            };
        });
  };

  function addItem() {
      inquirer.prompt([{
          name: "product",
          message: "What is the name of the product?"
      },
      {
        name: "department",
        message: "What is the department of the product?"
      },
    {
        name: "price",
        message: "what is the price of the product?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }

    },
    {
        name: "quantity",
        message: "How many of the products do you have?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }]).then(function(info) {

            connection.query("INSERT INTO products SET ?",
        {
           product_name: info.product,
           department_name: info.department,
           price: info.price,
           stock_quantity: info.quantity
        },
        function (err, res) {
            console.log(res.affectedRows + " products inserted!\n");
            startApp();
        });
    });
  }

    
    
