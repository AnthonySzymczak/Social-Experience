// reaction Schema only
const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema({
    //reactionId (use Mongoose ObjectId data type, default value is set to a new ObjectId)
    reactionId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    //reactionBody (String, required, 1-280 char min,max)
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    //username (String, required)
    username: {
        type: String,
        required: true
    },
    //createdAt(Date, Date.now, format timestamp on query)
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => dateFormat(timestamp)
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = reactionSchema;
