const router = require('express').Router();

//Object's declaration to retrieve, update, delete users, and to add/delete friends.
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
    //require user controller
} = require('../../controllers/user-controller');


//routes for retrieving all users and creating user
router
    .route('/')
    .get(getUsers)
    .post(createUser);


// routes by id, retieve user, update user, delete user
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)


//routes to see friends, add friend, delete friend
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend)



module.exports = router;