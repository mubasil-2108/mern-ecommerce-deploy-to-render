const mongose = require('mongoose');

const userSchema = new mongose.Schema({
    userName:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: 'user',
        // enum: ['user', 'admin'],
    },
})

const User = mongose.model('User', userSchema);
module.exports = User;