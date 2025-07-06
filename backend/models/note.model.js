const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    content: { type: String },
    tags: { type: [String], default: [] }, // tag expects array 

    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true }
});

module.exports = mongoose.model("Note", noteSchema);
