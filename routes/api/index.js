const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

//Tells the program which routes to use
//Specifically the users and thoughts routes are the main components

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;