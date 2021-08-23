const { User, Thought } = require('../models');

// Here begins the userController! 

const userController = {

// Retrieve all users
// Get route
//.... /api/users

    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

// Retrieve all users by id 
// Get route
//.... /api/users/:id

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: "-__v" },
            { path: 'friends', select: "-__v" }
        ])
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(
                    {message: 'Try again! Wrong User!'}
                    );
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

// Create user
// Post route
//.... /api/users

    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

// Update user by Id 
// Put route
//.... /api/users/:id

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(
                    { message: 'Wrong Id! Try again!' }
                    );
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

// Delete user by Id 
// Delete route
//.... /api/users/:id

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(
                    { message: 'Try again! No User Here!'}
                    );
                return;
            };
            User.updateMany(
                { _id : {$in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            )

            .then(() => {

                Thought.deleteMany({ username : dbUserData.username })
                .then(() => {
                    res.json(
                        {message: "User Removal Completed!"}
                        );
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    
// Update user's friends by Id 
// Post route
//.... /api/users/:userId/friends/:friendId

    addFriend({ params }, res) {

        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(
                    { message: 'Try again! No User Here' }
                    );
                return;
            }


            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData2 => {
                if(!dbUserData2) {
                    res.status(404).json(
                        { message: 'Try again! No User or Friends Here!' }
                        );
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },


// Update user's friends by Id 
// Delete route
//.... /api/users/:userId/friends/:friendId

//Here we need to isolate the user, and his friends to delete.

    deleteFriend({ params }, res) {

        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(
                    { message: 'Try again! No User Here!' }
                    );
                return;
            };


        User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData2 => {
                if(!dbUserData2) {
                    res.status(404).json(
                        { message: 'Try again: no friends here' }
                        );
                    return;
                }
                res.json(
                    {message: 'They are no longer your friend'}
                    );
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;