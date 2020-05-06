var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "INPUT YOUR USER HERE",
	password: "INPUT YOUR PASS HERE",
	database: "bamazon"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Welcome, you're connected as manager id" + connection.threadId);
});

function displayInventory() {
	connection.query('SELECT * FROM Products', function (err, res) {
		if (err) { console.log(err) };
		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
			colWidths: [10, 25, 25, 10, 14]
		});
		for (i = 0; i < res.length; i++) {
			theDisplayTable.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(theDisplayTable.toString());
		inquirerForUpdates();
	});
};

function inquirerForUpdates() {
	inquirer.prompt([{
		name: "action",
		type: "list",
		message: "Choose an option below to manage current inventory:",
		choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product", "Exit"]
	}]).then(function (answers) {
		switch (answers.action) {
			case 'Restock Inventory':
				restockRequest();
				break;
			case 'Add New Product':
				addRequest();
				break;
			case 'Remove An Existing Product':
				removeRequest();
				break;
			case 'Exit':
				process.exit(1);
		}
	});
};

function restockRequest() {
	inquirer.prompt([
		{
			name: "ID",
			type: "input",
			message: "What is the item number of the item you would like to restock?",
			filter: Number
		},
		{
			name: "Quantity",
			type: "input",
			message: "What is the quantity you would like to add?",
			filter: Number
		},
	]).then(function (answers) {
		var quantityAdded = answers.Quantity;
		var IDOfProduct = answers.ID;
		restockInventory(IDOfProduct, quantityAdded);
	});
};

function restockInventory(IDOfProduct, quantityAdded) {
	connection.query('SELECT * FROM Products WHERE item_id = ' + IDOfProduct, function (err, res) {
		if (err) { console.log(err) };
		connection.query('UPDATE Products SET stock_quantity = stock_quantity + ' + quantityAdded + ' WHERE item_id = ' + IDOfProduct);

		displayInventory();
	});
};

function addRequest() {
	inquirer.prompt([

		{
			name: "ID",
			type: "input",
			message: "Add ID Number"

		},
		{
			name: "Name",
			type: "input",
			message: "What is name of product you would like to stock?"
		},
		{
			name: "SubCategory",
			type: "input",
			message: "What is the sub-category for product?"
		},
		{
			name: "Category",
			type: "input",
			message: "What is the category for product?"
		},
		{
			name: "Price",
			type: "input",
			message: "What is the price for item?"
		},
		{
			name: "Quantity",
			type: "input",
			message: "What is the quantity you would like to add?"
		},

	]).then(function (answers) {
		var id = answers.ID;
		var name = answers.Name;
		var subcategory = answers.SubCategory;
		var category = answers.Category;
		var price = answers.Price;
		var quantity = answers.Quantity;
		buildNewItem(id, name, subcategory, category, price, quantity);
	});
};

function buildNewItem(id, name, subcategory, category, price, quantity) {
	connection.query('INSERT INTO products (item_id,product_name,sub_department_name,department_name,price,stock_quantity) VALUES("' + id + '","' + name + '","' + subcategory + '","' + category + '",' + price + ',' + quantity + ')');
	displayInventory();
};

function removeRequest() {
	inquirer.prompt([{
		name: "ID",
		type: "input",
		message: "What is the item number of the item you would like to remove?"
	}]).then(function (answers) {
		var id = answers.ID;
		removeInventory(id);
	});
};

function removeInventory(id) {
	connection.query('DELETE FROM Products WHERE item_id = ' + id);
	displayInventory();
};

displayInventory();