const { User, Thought, Reaction } = require('../models');


// Here begins the thoughtController!

const thoughtController = {


// Retrieve all thoughts api
// Get route
//.... /api/thoughts

    getThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },


// Retrieve Thoughts (by Id)
// Get route
//.... /api/thoughts/:id


    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(
                    {message: 'Try again: No Thought Here!'}
                    );
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

// Create new Thought
// Post route
//..../api/thoughts

    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json(
                        { message: 'Try again: No User Here!' }
                        );
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },


// Update Thought (by Id)
// Put Route
//.... /api/thoughts/:id 

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(
                    { message: 'Try again: No Thought here!' }
                    );
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },


// Delete thought (by id)
// Delete route
//.... /api/thought/:id

    deleteThought({ params }, res) {

        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(
                    { message: 'Try again: No Thought here!'}
                    );
                return;
            }

            User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json(
                    {message: 'Thought removal completed!'}
                    );
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

// Add Reaction
// Post route
//.... /api/thoughts/:id/reactions

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(
                    { message: 'Try again: No Thought here!' }
                    );
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },


// Delete Reaction
// Delete route
// .... /api/thoughts/:id/reactions

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json(
                    { message: 'Try again: No Thought here!' }
                    );
                return;
            }
            res.json(
                {message: 'Reaction removal completed'}
                );
        })
        .catch(err => res.status(500).json(err));
    },
}

//exports thoughtController
module.exports = thoughtController;