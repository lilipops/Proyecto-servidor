const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sescoockSchema = new Schema (
    {
        who: String,
        sescoock: String,
        time: Date,
    },
    {
        timestamps: false,
    },
)

const sescoock = mongoose.model('Sescoock', sescoockSchema)

module.exports = sescoock