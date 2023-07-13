const User = require('../models/user');
const Review = require('../models/review');

// Create new review controller function
module.exports.newReview = async (req, res) => {
  try {
    // Find the recipient user by ID
    let recipient = await User.findById(req.params.id);

    if (!recipient) {
      // If recipient user is not found, display an error flash message and redirect to the home page
      req.flash('error', "User not found in the database!");
      return res.redirect('/');
    }

    // Remove the recipient ID from the userToReview array of the current user
    for (let i = 0; i < req.user.userToReview.length; i++) {
      if (req.user.userToReview[i] == recipient.id) {
        await req.user.userToReview.splice(i, 1);
        await req.user.save();
        break;
      }
    }

    if (req.user) {
      // If the current user is logged in
      // Create a new review
      const new_review = await Review.create({
        content: req.body.newReview,      // The content of the review
        reviewBy: req.user.id,            // ID of the user leaving the review
        reviewBy_name: req.user.name,          // Name of the user leaving the review
        reviewTo: recipient.id,           // ID of the recipient user being reviewed
        // reviewBy_rname: recipient.name,         // Name of the recipient user being reviewed
        
        
      });

      // Add the new review to the recipient's reviewRecivedFrom array
      await recipient.reviewRecivedFrom.push(new_review);
      await recipient.save();
    } else {
      // If the current user is not logged in, display an error flash message and redirect to the sign-in page
      req.flash('error', "Please log in first!");
      return res.redirect("/users/sign-in");
    }

    // Redirect to the home page after successfully creating the review
    return res.redirect('/');
  } catch (err) {
    // If an error occurs, log the error and redirect to the home page
    console.log('error', err);
    return res.redirect('/');
  }
}