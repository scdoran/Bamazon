var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: "root",
	database: "Bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("Connected as id: " + connection.threadId);
});

function initialQuestion(){

	inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "Type in the ID of the item you would like to purchase."
		
		}
	]).then(function (answer) {
	    connection.query('SELECT * FROM products WHERE item_id="' + answer.id + '"', function(err, res){
			if (err) throw err;
				console.log("******************");
				console.log("You selected a(n)" + res[0].product_name);
				purchase(res[0].product_name);	
		});
	});
}

function purchase(product){
	inquirer.prompt([
	{
		type: "input",
		name: "purchase",
		message: "How many would you like to purchase?"
	}
	]).then(function(answers){
		console.log("You purchased " + answers.purchase + " " + product);
		connection.query('SELECT"' + product + '"FROM products', function(err, res){
		if (err) throw err;
		if (product.stock_quantity >= answers.purchase){

			var update = product.stock_quantity - answers.purchase;
			var cost = answers.purchase * product.price;

			connection.query('UPDATE products SET stock_quantity ="' + update + '"WHERE product_name = product', function(res){
				console.log("******************");
				console.log("That will be a total of $" + cost);
			});
		} else {
			console.log("Not enough " + product + " in stock.");
		}
		initialQuestion();		
		});
	});
}

initialQuestion();