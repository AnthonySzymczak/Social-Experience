//Schema / model setup
const { Schema, model } = require('mongoose');

// username, email, thoughts, friends
const userSchema = new Schema({
    //username (type String, unique, required, trimmed)
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    //email (type String, required, unique, match valid email address)
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/([A-za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/]
    },
    //thoughts Array of _id values referencing the Thought Model
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    //friends Array of _id values referencing the User Model
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{
    // Always set toJson
    toJSON: {
        virtuals: true
    },
    id: false
});

//Virtual called friendCount that retrieves the length of the user's friends [] on query
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema);

// export to user
module.exports = User;