const User = require('../models/user');
const Review = require('../models/review');


// This function is for assigning Work, and sending some data to it.
module.exports.assignWork = async function (req, res) {
    let employee = await User.find({});

    return res.render('admin', {
        title: 'Assign Work | ERSystem',
        employee: employee
    });
};


// This function will show the list of employee woking in the company.
module.exports.showEmployeeList = async function (req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not Authorized Dear !');
        return res.redirect('/users/sign-in');
    }
    if (req.user.isAdmin == false) {
        req.flash('error', 'You are not Authorized to access');
        return res.redirect('/');
    }
    let employeList = await User.find({});

    return res.render('employee', {
        title: "Employe-List | ERSystem",
        employes: employeList
    });
};

// View employee reviews
module.exports.viewEmployeeReviews = async function(req , res){
    let reviews = await Review.find({ reviewTo: req.params.id }).sort('-createdAt');
    let employee = await User.findById(req.params.id );

    return res.render('employee_review',{
        title: "Reviews | ERSystem",
        reviews, 
        employee            
    });
};



// This function will set the reviewer and reviewer.
module.exports.setReviewers = async function (req, res) {
    try {

        if (!req.isAuthenticated()) {
            req.flash('success', 'Please Login!');
            return res.redirect('/users/sign-in');
        }
        else {
            let loggedInUser = await User.findById(req.user.id);

            if (!loggedInUser.isAdmin) {
                req.flash('error', 'You are not Authorized');
                return res.redirect('/users/create-session');

            }
            else if (req.body.employee == "Select an Employee") {
                req.flash('error', 'Please select an Employee!');
                return res.redirect('back');

            }
            else {
                let allEmployees = await User.find({});
                let selectedEmployee = await User.findById(req.body.employee);

                for (let i = 0; i < allEmployees.length; i++) {
                    if (allEmployees[i]._id.toString() !== selectedEmployee._id.toString()) {

                        let isAlreadyAdded = allEmployees[i].userToReview.includes(selectedEmployee._id);

                        if (!isAlreadyAdded) {
                            allEmployees[i].userToReview.push(selectedEmployee._id);
                            await allEmployees[i].save();
                        }
                    }
                }

                // req.flash('success', 'Task Assigned to the User!');
                req.flash('success', `Review is created for ${selectedEmployee.name}`);
                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log('Error in setting up the user: ' + err);
        req.flash('error', 'Unable to Assign a Task the User!');
        return res.redirect('back');
    }
};



// This function is for making the new Admin
module.exports.newAdmin = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            req.flash("success", 'Please log in!');
            return res.redirect('/users/sign-in');
        }
        if (req.user.isAdmin == false) {
            req.flash('error', 'You cannot make anyone an admin!');
            return res.redirect('/');
        }

        if (req.body.employee == "Select to make an Admin") {
            req.flash('error', 'Please select an employee');
            return res.redirect('back');
        }
        let user = await User.findById(req.body.employee);
        if (!user) {
            req.flash('error', 'Unable to find employee');
            return res.redirect('back');
        }
        user.isAdmin = true;
        await user.save();
        req.flash('success', `${user.name} is admin Now !! `);
    } catch (err) {
        req.flash('error', 'Internal Server Error!');
        console.log(err);
    }
    return res.redirect('back');
}


// This function is for deleting the employee
module.exports.deleteEmployee = async function (req, res) {
    try {

        if (!req.isAuthenticated()) {
            req.flash('error', 'Please Login !')
            return res.redirect('users/sign-in');
        }

        if (!req.user.isAdmin) {

            req.flash('error', 'You are not an admin !')
            return res.redirect('/');
        }

        await User.deleteOne({ _id: req.params.id });

    // Remove the employee from the userToReview array of other employees
    await User.updateMany(
      { userToReview: req.params.id },
      { $pull: { userToReview: req.params.id } }
    );


    req.flash('success', 'User Deleted!')
        return res.redirect('back');

    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};


module.exports.addtoshowEmployee = function (req, res) {
    return res.render('addEmployee', {
        title: 'ERSystem | Add Employee'
    });
}



// Add an employee
module.exports.addEmployee = async function (req, res) {
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Password should be equal to Confirm Password');
        return res.redirect('back');
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: false
        });

        return res.redirect('/admin/view-employee');
    }
    return res.redirect('back');
}