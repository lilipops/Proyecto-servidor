const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CoockiesSchema = new Schema (
    {
        who: String,
        coockies: String,
    },
    {
        timestamps: true,
    },

)

const coockies = mongoose.model('Coockies', CoockiesSchema)

module.exports = coockies