var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
const chalk = require("chalk"); // 'chalk' ?
var Table = require("cli-table");
// const env = process.env;

module.exports = showInventory;

var pwd = require("./pwd"); // ./pwd.js
var sqlpwd = pwd.sqlpwd;

var bamazon = require("./bamazon");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: sqlpwd.password,
    database: "bamazon"
});

var table = new Table({
    head: ['Item ID', 'Name', 'Department', 'Price'],
    colWidths: [10, 60, 20, 25]
});
// connection.connect(function(error) {
//     if (error) throw error;
//     showInventory();
// });

function showInventory() { //displayItems()
    // console.log("Displaying all available items...");
    var query = connection.query('SELECT * FROM products', function(err, res) {
        if (err) {
            console.log(err)
        } 
        
        for (var i=0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
        } 
        console.log('   ------------------------------- TESTING -------------------------------\n')
        console.log(table.toString());
        promptBuy();
    });

};  // End of showInventory()

function promptBuy() {
    inquirer.prompt([
    { 
        name: "item_ID",
        type: "input",
        message: "What is the item ID of product you plan on purchasing",
    },
    {
        name: "quantity",
        type: "input",
        message: "How many of this product do you intend to order?"
    }
    ])
    .then(function(answer) {
        var query = "SELECT * FROM products WHERE ?";

    })

}   // End of promptBuy()
