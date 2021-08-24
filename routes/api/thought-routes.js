const router = require('express').Router();

//Object's declaration to retrieve, update, delete thoughts, and to add/delete reactions.
const {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
    // requires thought controller
} = require('../../controllers/thought-controller');

//routes for retrieving all thoughts, and creating thoughts
router
    .route('/')
    .get(getThoughts)
    .post(createThought);

// routes by id, retrieving, updating, and deleting thoughts.
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

//routes to add and delete reactions
router
    .route('/:thoughtId/reactions/')
    .post(addReaction)
    .delete(deleteReaction);

module.exports = router;