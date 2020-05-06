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
	console.log("Welcome, you're connected as customer id" + connection.threadId);
});

var displayProducts = function () {
	var query = "Select * FROM products";
	connection.query(query, function (err, res) {
		if (err) throw err;
		var displayTable = new Table({
			head: ["Item ID", "Product Name", "Sub-Category", "Catergory", "Price", "Quantity"],
			colWidths: [10, 25, 25, 25, 10, 14]
		});
		for (var i = 0; i < res.length; i++) {
			displayTable.push(
				[res[i].item_id, res[i].product_name, res[i].sub_department_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(displayTable.toString());
		purchasePrompt();
	});
}

function purchasePrompt() {
	inquirer.prompt([
		{
			name: "ID",
			type: "input",
			message: "Please enter Item ID you like to purhcase.",
			filter: Number
		},
		{
			name: "Quantity",
			type: "input",
			message: "How many items do you wish to purchase?",
			filter: Number
		},

	]).then(function (answers) {
		var quantityNeeded = answers.Quantity;
		var IDrequested = answers.ID;
		purchaseOrder(IDrequested, quantityNeeded);
	});
};

function againPrompt() {
	inquirer.prompt([
		{
			name: "ans",
			type: "input",
			message: "Would you like to make another purchase?"
		}
	]).then(function (answers) {
		var a = answers.ans;
		again(a);
	});
};

function again(a){
	b = a.toLowerCase();
	if (a === 'y' || a === 'yes'){
		displayProducts();
	}
	else if(a === 'n' || a === 'no'){
		console.log("Thank you for shopping with bamazon :)");
		process.exit(1);
	}
	else{
		console.log("Error 0002: invalid response");
		console.log("Please enter 'y/n' or 'yes/no'");
		againPrompt();
	}
}


function purchaseOrder(ID, amtReq) {
	connection.query('Select * FROM products WHERE item_id = ' + ID, function (err, res) {
		if (err) { console.log(err) };
		if (amtReq <= res[0].stock_quantity) {
			var totalCost = res[0].price * amtReq;
			console.log("Order filed...");
			console.log("Your total cost for " + amtReq + " " + res[0].product_name + " is " + totalCost + " Thank you!");

			connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + amtReq + ' WHERE item_id = ' + res[0].item_id);
		} else {
			console.log("Unable to complete your order request" + res[0].product_name + " error 0001:");
			console.log("'Insufficent inventory'")
		};
		againPrompt();
	});
};

displayProducts(); 