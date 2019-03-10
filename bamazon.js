var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
const chalk = require("chalk"); // 'chalk' ?
// const env = process.env;

var pwd = require("./pwd"); // ./pwd.js
var sqlpwd = pwd.sqlpwd;

var bamazonCustomer = require("./bamazonCustomer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: sqlpwd.password,
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
    // console.log("connected as id " + connection.threadId);
    inquirer.prompt([{
        type: "list",
        name: "levels",
        message: "What would you like to do?",
        choices: ["Customer","Manager","Supervisor","Exit"]
    }]).then(answers => {
        switch(answers.levels) { 
        case "Customer":
            bamazonCustomer();
            break;
        case "Manager":
            console.log("Manager level is under construction!")
            break;
        case "Supervisor": 
            console.log("Supervisor level is under construction!")
        case "Exit":
            connection.end();
            break;
        default:
            console.log("You did not make a selection.")
            break;
        }
    });
});

