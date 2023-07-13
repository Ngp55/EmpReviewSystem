module.exports.setFlash = function(req , res ,next){
// res.locals.flash is an object that will hold flash messages.
res.locals.flash={
    'success': req.flash('success'), // Assigns the 'success' flash message to the 'success' property of res.locals.flash.
    'error': req.flash('error') // Assigns the 'error' flash message to the 'error' property of res.locals.flash.
}

next(); // Calls the next middleware function in the chain.
};