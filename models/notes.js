import mongoose from "mongoose";

const notes = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Notes = mongoose.model('Notes', notes);

export default Notes;