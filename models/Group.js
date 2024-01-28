const mongoose = require("mongoose");
const {Schema} = mongoose

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    groupSize : {
        type: Number,
        required: true
    }
}, {timestamp: true})

const Group = mongoose.model('Group', groupSchema);

module.exports = Group