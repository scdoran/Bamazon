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
	initialQuestion();
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
		console.log("You purchased " + answers.purchase + " " + product + "(s).");

		connection.query('SELECT * FROM products WHERE product_name="' + product + '"', function(err, res){
		if (err) throw err;
		if (res[0].stock_quantity >= answers.purchase){

			var update = res[0].stock_quantity - answers.purchase;
			var cost = answers.purchase * res[0].price;

			connection.query('UPDATE products SET stock_quantity ="' + update + '"WHERE product_name ="' + product + '', function(res){
				console.log("******************");
				console.log("There are now " + update + " in stock.");
				console.log("******************");
				console.log("That will be a total of $" + cost);
				initialQuestion();
			});
		} else if (res[0].stock_quantity < answers.purchase){
			console.log("Not enough " + product + " in stock.");
			initialQuestion();
		}		
		});
	});
}