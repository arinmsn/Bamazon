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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.end();
});

inquirer.prompt([{
    name: 'Category',
    message: 'Please, choose from one of the choices below: ',
    type: 'list',
    choices: [{
        name: 'Customer'
    },{
        name: chalk.gray('Manager')
    },{
        name: chalk.gray('Supervisor')
    }]
}]).then(function (answer) {
    if (answer.command === 'Customer') {
        bamazonCustomer();
    } else if (answer.command === chalk.gray('Manager')) {
        //bamazonManager();
        console.log("Manager access is not available due to maintenance.");
    } else if (answer.command === chalk.gray('Supervisor')) {
        //bamazonSupervisor();
        console.log("Supervisor access is not available due to maintenance.");
    }
});