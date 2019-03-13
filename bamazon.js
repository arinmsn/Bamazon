var bamazonCustomer = require('./bamazonCustomer');
// console.log(bamazonCustomer);
// console.log(bamazonCustomer.showInventory);
// console.log(bamazonCustomer.promptBuy);


var mysql = require('mysql');
var inquirer = require('inquirer');
require('dotenv').config();
const chalk = require('chalk'); // 'chalk' ?
// const env = process.env;

// var pwd = require('./pwd'); // ./pwd.js
// var sqlpwd = pwd.sqlpwd;


// var connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: sqlpwd.password,
//     database: 'bamazon'
// });

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
//     connection.end();
// });

inquirer.prompt([{
    type: 'list',
    name: 'levels',
    message: 'What would you like to do?',
    choices: ['Customer','Manager','Supervisor','Exit']
}]).then(answers => {
    switch(answers.levels) { 
    case 'Customer':
        bamazonCustomer.runApp();
        break;
    case 'Manager':
        console.log('Manager level is under construction!')
        break;
    case 'Supervisor': 
        console.log('Supervisor level is under construction!')
    case 'Exit':
        // connection.end();
        break;
    default:
        console.log('You did not make a selection.')
        break;
    }
    return;
});
