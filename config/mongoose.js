const mongoose = require('mongoose');
// The URI is the connection string for the MongoDB database.
const uri = 'mongodb://0.0.0.0/Emp';

// The following code connects to the MongoDB database using the provided URI.
mongoose.connect(uri).then(()=>{
console.log('Connected to Database: Bababa'); // Prints a success message to the console when the connection is established.
}).catch((err) => console.log("no connection " + err)); // Prints an error message to the console if the connection fails.

// The 'db' variable is assigned the connection object returned by mongoose.connection.
const db = mongoose.connection;

// Exporting the 'db' object to be used in other parts of the application.
module.exports = db;