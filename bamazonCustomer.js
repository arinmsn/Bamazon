var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
const chalk = require("chalk"); // 'chalk' ?
var Table = require("cli-table");
// const env = process.env;



var pwd = require("./pwd"); // ./pwd.js
var sqlpwd = pwd.sqlpwd;

// var bamazon = require("./bamazon"); 


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: sqlpwd.password,
    database: "bamazon"
});

function runApp() {

    connection.connect(function (err) {
        if (err) throw err;
        console.log(`\nConnected as id ${connection.threadId}\n`)
        showInventory();
    });

    function showJustTable() {

        connection.query('SELECT * FROM products', function (err, res) {
            if (err) throw err;

            var table = new Table({
                head: ['Item ID', 'Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 60, 20, 25, 10]
            });

            for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
            }
            // console.log(`\n`)
            console.log(table.toString());
        });
    }


    function showInventory() { //displayItems()
        // console.log("Displaying all available items...");

        connection.query('SELECT * FROM products', function (err, res) {
            if (err) throw err;

            var table = new Table({
                head: ['Item ID', 'Name', 'Department', 'Price', 'Quantity'],
                colWidths: [10, 60, 20, 25, 10]
            });


            for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
            }
            // console.log(`\n`)
            console.log(table.toString());
            // console.table(res);   // Use this next time for creating table
            promptBuy();
        });

    };  // End of showInventory()

    // validation_Function()

    function promptBuy() {

        inquirer.prompt([
            {
                type: 'input',
                name: 'item_id',
                message: 'Enter the item Id of product you plan on purchasing:  ',
                // validate: validation__function()
                filter: Number
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Enter the quantity:  ',
                // validate: validation__function() 
                filter: Number
            }
        ]).then(function (input) {

            var item = input.item_id;
            var quantity = input.quantity;
            var queryBuyString = 'SELECT * FROM products WHERE ?';

            connection.query(queryBuyString, { item_id: item }, function (err, data) {
                if (err) throw err;

                if (data.length === 0) {
                    console.log('Invalid item ID #. Please, enter a valid item ID: ');
                    showInventory();
                } else {
                    // if item is in stock ...
                    var itemData = data[0];
                    if (quantity <= itemData.stock_quantity) {
                        console.log('Great news. It looks like we have that in stock!');
                        console.log('Placing your order. Thank you for your patience.');
                        var newQty = (itemData.stock_quantity - quantity);

                        var updatedQuery = 'UPDATE products SET ? WHERE ?'
                        var total = (itemData.price * quantity).toFixed(2);

                        // Updating inventory...
                        var updatedQuery = 'UPDATE products SET stock_quantity = ' +
                            (itemData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                        connection.query(updatedQuery, function (err, res) {
                            if (err) throw err;

                            console.log(`\n`)
                            console.log(`---------- Summary of your order ---------`);
                            console.log(`Product: ${itemData.product_name}`);
                            console.log(`Quantity: ${quantity}`);
                            console.log(`------------------------------------------`);
                            console.log(`Order total: $${total}`);
                            console.log(`------------------------------------------`);
                            console.log(`\n`);
                            console.log('--- Inventory updated ---')
                            showJustTable();
                            // promptBuy();
                            connection.end();
                        })
                    } else if (itemData.stock_quantity < 5) {
                        console.log('Insufficient product in stock.');
                        console.log('Change your order, please.');
                        console.log('\n');
                        showInventory();
                    } else if (quantity > itemData.stock_quantity) {
                        console.log("That's lot more than we carry.");
                        console.log('Change your order, please.');
                        console.log('\n');
                        showInventory();
                        // inquirer.prompt([
                        //     {
                        //         type: "confirm",
                        //         name: "repeat",
                        //         message: "Would you like to buy something else? "
                        //     }
                        // ]).then(function(input) {
                        //     if (input) {
                        //         promptBuy();
                        //     } else {
                        //         connection.end();
                        //     }
                        // });
                    }
                    // } //else

                };
            });
        });
    };


} // runapp() ENDS

module.exports = {

    runApp: runApp

}