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
      
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("--------------------");

          for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + parseFloat(res[i].price).toFixed(2));
            console.log("--------------------");
          }
          runApp();

        }
      } );
    }
  });

  function runApp() {
    inquirer.prompt([{
      name: "Id",
      type: "input",
      message: "What is the ID of the item you would like to purchase?",
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like to purchase?",
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }]).then(function(response) {
      connection.query("SELECT * FROM products WHERE item_id=?",[response.Id], function(err, res) {
        if (err) {
          console.log(err);
        } else {
              // console.log(res[0].stock_quantity + " | " + response.quantity);
              let cost = res[0].price;
              let ID = response.Id;
              let Quantity = parseFloat(res[0].stock_quantity) - parseFloat(response.quantity);
              console.log(Quantity);
              if (Quantity >= 0) {
                    let total = parseFloat(cost) * parseFloat(response.quantity);
                    connection.query("UPDATE products SET ? WHERE ?", [{
                      stock_quantity: Quantity
                    },
                    {
                      item_id: ID
                    }], function(error, result) {
                      if (error) {
                        console.log(error);
                      } else {
                        
                        console.log(result.affectedRows + " products updated!");
                        console.log("You spent $" + parseFloat(total).toFixed(2) + " on your order today!");
                        connection.end();

              
                      }
                    } );
              }else {
                console.log("Insufficiant Quantity.");
                runApp();
              }

        }
      } );
      
  })
  }