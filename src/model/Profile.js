const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    bio: String,
    avatar: String
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile