import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    verified_documents: {
        type: Schema.Types.ObjectId,
        ref: "Verified"
    },
});

const Course = mongoose.model("Course", courseSchema);