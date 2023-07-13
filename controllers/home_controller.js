const User = require('../models/user');
const Review = require('../models/review');

module.exports.home = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Please sign in!');
            return res.redirect('/users/sign-in');
        }

        let user = await User.findById(req.user.id);
        let recipient = [];
        let reviews = [];

        if (user.isAdmin) {
            // If the user is an admin, retrieve all reviews
            reviews = await Review.find().sort('-createdAt');
        } else {
            // Find the reviews addressed to the logged-in user
            reviews = await Review.find({ reviewTo: req.user.id }).sort('-createdAt');

            // Find the users to review for the logged-in user
            for (let i = 0; i < user.userToReview.length; i++) {
                let userToReview = await User.findById(user.userToReview[i]);
                recipient.push(userToReview);
            }
        }

        return res.render('home', {
            title: "HOME | ERSystem",
            recipient: recipient,
            reviews: reviews,
            user: user
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};
