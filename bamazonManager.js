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
	initialQuestion();
});

// Function that runs the inital inquirer question.
function initialQuestion(){
	inquirer.prompt([
		{
			type: "list",
			name: "menu",
			message: "What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		
		}
	]).then(function (answer) {
		// Switch case needed depending on what the manager selects.
	    switch (answer.menu) {
	      case "View Products for Sale":
	        viewProducts();
	        break;

	      case "View Low Inventory":
	        viewLow();
	        break;

	      case "Add to Inventory":
	        addInventory();
	        break;

	      case "Add New Product":
	        addProduct();
	        break;
    	}
	});
}

// Function that selects all data from the products table and shows it in the console.
function viewProducts(){
	connection.query('SELECT * FROM products', function(err, res){
		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("******************************************");
			console.log("Item ID: " + res[i].item_id);
			console.log("Product: " + res[i].product_name);
			console.log("Department: " + res[i].department_name);
			console.log("Price: $" + res[i].price);
			console.log("Quantity: " + res[i].stock_quantity);
		}
	// Pulls up the initial question. 
	initialQuestion();	
	
	});
}

// Function that selects all products that have a quantity of less than 5000 from the products table and shows it in the console.
function viewLow(){

	connection.query('SELECT * FROM products WHERE stock_quantity < 5000', function(err, res){
		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("******************************************");
			console.log("Item ID: " + res[i].item_id);
			console.log("Product: " + res[i].product_name);
			console.log("Department: " + res[i].department_name);
			console.log("Quantity: " + res[i].stock_quantity);
		}
	// Pulls up the initial question. 
	initialQuestion();	

	});
}

// Function that allows the manager to add more inventory to an existing product.
function addInventory(){

	inquirer.prompt([
	{
		type: "input",
		name: "productName",
		message: "Please type in the name of the product you would like to restock: "
	},
	{
		type: "input",
		name: "quantity",
		message: "How much inventory would you like to add?"
	}
	]).then(function(answers){
		console.log("You are updating " + answers.productName + ".");
		// Selects the data based on product name...
		connection.query('SELECT * FROM products WHERE product_name="' + answers.productName + '"', function(err, res){
		if (err) throw err;

			var update = res[0].stock_quantity + parseInt(answers.quantity);
			// Updates the products based on adding the original stock quantity with the manager's quantity.
			connection.query('UPDATE products SET stock_quantity ="' + update + '"WHERE product_name ="' + answers.productName + '', function(res){
				console.log("******************");
				console.log("There are now " + update + " in stock.");
				console.log("******************");
				initialQuestion();
			});		
		});
	});	
}

// Function that allows the manager to add new products.
function addProduct(){
	// Inquirer asks all questions in regard to the product name, department, price and quantity.
	inquirer.prompt([
	{
		type: "input",
		name: "productName",
		message: "Please type in the name of the product: "
	},
	{
		type: "input",
		name: "department",
		message: "Please type in the department: "
	},
	{
		type: "input",
		name: "price",
		message: "Please type in the price (without $): "
	},
	{
		type: "input",
		name: "quantity",
		message: "Please type in the quantity: "
	}

	]).then(function(answers){
		console.log("You are adding " + answers.productName + ".");

		// Adds the new product based on the manager's input from inquire.
		connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + answers.productName + '","' + answers.department + '","' + answers.price + '","' + answers.quantity + '")', function(err, res){
		if (err) throw err;

		console.log("Item successfully added!");
		initialQuestion();
		});
	});
}