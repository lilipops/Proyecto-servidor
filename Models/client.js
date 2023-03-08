const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ClientSchema = new Schema (
    {
        who: String,
        yourname: String,
        email: String,
        tlf: String,
        passwd: String,
        adress: String,
        postalcode: String, 
        trabajos: String,
        
    },
    {
        timestamps: false,
    },

)

const Client = mongoose.model('Client', ClientSchema)

module.exports = Client