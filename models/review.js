const mongoose = require('mongoose');

// The reviewSchema is a schema definition for the 'Review' collection in the MongoDB database.
const reviewSchema = mongoose.Schema({
    content: {
            type: 'String',
            require: true // Specifies that the 'content' field is required.
            },
    reviewTo: {
            type: mongoose.Schema.Types.ObjectId, // Specifies that the 'reviewTo' field is of type ObjectId.
            ref: 'User', // Specifies that the ObjectId refers to the 'User' collection.
            required: true // Specifies that the 'reviewTo' field is required.  
            },
    reviewBy: {
            type: mongoose.Schema.Types.ObjectId, // Specifies that the 'reviewBy' field is of type ObjectId.
            ref: 'User', // Specifies that the ObjectId refers to the 'User' collection.
            required: true // Specifies that the 'reviewBy' field is required.
            },
    reviewBy_name: {
            type: 'String',
            require: true // Specifies that the 'reviewBy_name' field is required.
            }
    },
            {
            timestamps: true, // Specifies that the 'Review' collection should include timestamps for creation and modification.
});

// The Review model is created based on the reviewSchema.
const Review = mongoose.model('Review', reviewSchema);

// Exporting the Review model to be used in other parts of the application.
module.exports = Review;