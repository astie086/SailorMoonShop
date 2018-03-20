var mysql = require("mysql");
var inquirer = require('inquirer');
var amountOwed;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mastin86",
  database: "bamazon_db"
});

  connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection is successful");
  start();
});

// displays all the products, price and quantitites 
var start = function() {

    console.log("Welcome to the Sailor Moon Shop!")
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i=0; i<res.length; i++) {
            console.log(res[i].itemid + " | " + res[i].product_name + " | " + res[i].department_name + " | $"  +  res[i].price + " | Quantity:" + res[i].stock_quantity)
        }
        inquirer.prompt([
            {// prompts user for id of item they want   
              type: "input",
              name: "id",
              message: "What is the ID of the Weapon or Crystal you would like to purchase?",
              validate: function(value){
                if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
                  return true;
                } else{
                  return false;
                }}},
            
            {// prompts user for id of item they want    
              type: "input",
              name: "qty",
              message: "How much would you like to purchase?",
              validate: function(value){
                if(isNaN(value)){
                  return false;
                } else{
                  return true;
                }
              }
    }])


// checking inventory
    .then(function(answer){ // checking your database and itemid is what it is called there
        connection.query('SELECT * FROM products WHERE itemid = ?', [answer.id], function(err, res){
            console.log(res);
                
            if(answer.qty > res[0].stock_quantity){
                console.log('Sorry, this product is not in stock!');
                console.log("\n---------------------------------------------------------------------\n");
                console.log("\n---------------------------------------------------------------------\n");
                console.log("\n---------------------------------------------------------------------\n");
                start();
            }
            // displaying price
            else{
                amountOwed = res[0].price * answer.qty;
                console.log("\n---------------------------------------------------------------------\n");
                console.log('Thanks for your order');
                // japanese currency. will it affect code?
                console.log('You owe ¥' + amountOwed);
                console.log("\n---------------------------------------------------------------------\n");
                console.log("\n---------------------------------------------------------------------\n");
                console.log("\n---------------------------------------------------------------------\n");

                //update products table
                connection.query('UPDATE products SET ? Where ?', [{
                    stock_quantity: res[0].stock_quantity - answer.qty
                },{
                    id: answer.selectitemid
                }], function(err, res){});
                start();
            }}
        )}
    )}
)}
