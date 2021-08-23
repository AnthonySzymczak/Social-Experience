//  setting up the schema, declaration of moment for date time
const { Schema, model } = require('mongoose');
const moment = require('moment');
const reactionSchema = require('./Reaction');


//thoughtText, created at, username, reactions

//thoughtText: (String, required, between 1-280 characters)
//createdAt: (Date, Date.now, format timestamp on query)
//username: ((user that created this thought) String, required)
//reactions:(Array of nested documents created with reactionSchema(reactions: [reactionSchema] ?)

//(reactionCount, retrieves reactions.length, (thought's reactions array field on query))