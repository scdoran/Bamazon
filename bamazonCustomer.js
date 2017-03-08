// Creating a variable to require both mysql and inquirer npm packages.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Creating a connection to the MySQL server.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: "root",
	database: "Bamazon"
});

// Connecting to the server and then launching the initial question and showing invetory if the connection is successful.
connection.connect(function(err){
	if (err) throw err;
	console.log("Connected as id: " + connection.threadId);
	showInventory();
	setTimeout(initialQuestion, 1000);
});

// Function that will show all data in the Bamazon database.
function showInventory(){
	connection.query('SELECT * FROM products', function(err, res){
		for (var i = 0; i < res.length; i++) {
			console.log("******************************************");
			console.log("Item ID: " + res[i].item_id);
			console.log("Product: " + res[i].product_name);
			console.log("Department: " + res[i].department_name);
			console.log("Price: $" + res[i].price);
			console.log("Quantity: " + res[i].stock_quantity);
		}
	});
}

// Function that runs the inital inquirer question.
function initialQuestion(){

	inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "Type in the ID of the item you would like to purchase."
		
		}
	]).then(function (answer) {
		// Selecting all from the products table where the product id is found.
	    connection.query('SELECT * FROM products WHERE item_id="' + answer.id + '"', function(err, res){
			if (err) throw err;
				console.log("******************");
				console.log("You selected a(n)" + res[0].product_name);
				purchase(res[0].product_name);	
		});
	});
}

// Function that will allow the customer to purchase the item selected.
function purchase(product){
	inquirer.prompt([
	{
		type: "input",
		name: "purchase",
		message: "How many would you like to purchase?"
	}
	]).then(function(answers){
		console.log("You purchased " + answers.purchase + " " + product + "(s).");
		// Selecting all from products where the product name matches.
		connection.query('SELECT * FROM products WHERE product_name="' + product + '"', function(err, res){
		if (err) throw err;

		// If the stock quantity is sufficient...
		if (res[0].stock_quantity >= answers.purchase){
			// Updated total.
			var update = res[0].stock_quantity - answers.purchase;
			// Cost calculator.
			var cost = answers.purchase * res[0].price;

			// Update the quantity within the table where the product name matches.
			connection.query('UPDATE products SET stock_quantity ="' + update + '" WHERE product_name ="' + product + '"', function(err, res){
			
			if (err) throw err;
				
				console.log("******************");
				console.log("There are now " + update + " in stock.");
				console.log("******************");
				console.log("That will be a total of $" + cost);
				// Invetory is shown along with the initial question once the transaction is complete.
				showInventory();
				setTimeout(initialQuestion, 1000);
			});
		// If there is not enough of the product in stock... 
		} else if (res[0].stock_quantity < answers.purchase){
			console.log("Not enough " + product + " in stock.");
			initialQuestion();
		}		
		});
	});
}