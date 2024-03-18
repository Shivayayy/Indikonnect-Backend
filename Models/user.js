const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    if (this.isModified('Password')) {
        bcrypt.hash(this.Password, 8, (err, hash) => {
            if (err) return next(err);
            this.Password = hash; // Fixed typo here
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function(Password) {
    if (!Password) throw new Error('Password is missing, cannot be compared'); // Throw the error
    try {
        const result = await bcrypt.compare(Password, this.Password);
        return result;
    } catch (error) {
        throw new Error('Error while comparing password: ' + error.message); // Throw the error
    }
}
userSchema.statics.findByCredentials = async function(UserName, Password) {
    const user = await this.findOne({ UserName });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
        throw new Error('Invalid username or password');
    }
    return user;
};


module.exports = mongoose.model('User', userSchema, 'User');
