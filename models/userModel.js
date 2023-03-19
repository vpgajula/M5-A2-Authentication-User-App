const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true, // this will make sure name is required
        unique: true // this will make sure the name is unique
    },
    email: {
        type: String,
        required: true,
        unique: true // this will make sure the email is unique
    },
    password: {
        type: String,
        required: true 
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: { // this is for validating password and confirm password
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    date: {
        type: Date,
        default: Date.now //this will automatically add the date
    }
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

//this function will run before the user is saved to the database
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
        this.confirmPassword = undefined // so that it does not store in the database
    }
    next();
});

//this function generates the token
userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id: this._id}, process.env.TOKEN_SECRET_KEY);
        //this.tokens = this.tokens.concat({token: token});
        //await this.save();
        console.log('Gen Auth Token is: ' + token)
        return token;
    } catch (error) {
        console.log(error);
    }
};

//this function will compare the passwords
userSchema.methods.verifypassword = async function(password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       throw new Error('Unable to login!');  
    }
    return user;
};

//this function will search the user by the given credentials in the database
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await user.findOne({ email });
    if (!user) {
        throw new Error('Unable to login!');
    } 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login!');  
     }
     return user;
};

module.exports = mongoose.model('User', userSchema);
