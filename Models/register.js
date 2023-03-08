const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RegisterSchema = new Schema (
    {
        who: String,
        yourname: String,
        email: String,
        tlf: String,
        adress: String,
        postalcode: String, 
        trabajos: String
    },
    {
        timestamps: false,
    },

)

const Register = mongoose.model('Register', RegisterSchema)

module.exports = Register