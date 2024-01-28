const mongoose = require('mongoose')
const {Schema} = mongoose

const paymentSchema = new Schema({
    id: String,
    value: String
})

const memberSchema = new Schema({
    additionalInputs: [paymentSchema]
})

const peopleSchema = new Schema({
    name: String
})

const pageSchema = new Schema({
    id: String,
    groupName: String,
    people: [peopleSchema],
    members: [memberSchema],
    payment: {
        type: [{ type: Schema.Types.Mixed }],
        default: () => ({})
    },
    reason: {
        type: [{ type: Schema.Types.Mixed }],
        default: () => ({})
    },
    transactions: [String],
    count: Number
})

const Page = mongoose.model('Page', pageSchema)
module.exports = Page