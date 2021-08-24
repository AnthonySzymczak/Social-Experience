//  setting up the schema, require dateFormat for date time
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');


//thoughtText, created at, username, reactions
const thoughtSchema = new Schema({
    //thoughtText: (String, required, between 1-280 characters)
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    //createdAt: (Date, Date.now, format timestamp on query)
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => dateFormat(timestamp)
    },
    //username: ((user that created this thought) String, required)
    username: {
        type: String,
        required: true
    },
    //reactions:(Array of nested documents created with reactionSchema(reactions: [reactionSchema] ?)
    reactions: [reactionSchema]
},
{
    //Always set toJson
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

//(reactionCount, retrieves reactions.length, (thought's reactions array field on query))
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

//export to Thought
module.exports = Thought;

