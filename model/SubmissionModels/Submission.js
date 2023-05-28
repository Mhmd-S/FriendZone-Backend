import mongoose from "mongoose";

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    file: {
        data: Buffer,
        contentType: String
    },
})

export const Submission = mongoose.model("Submission", submissionSchema);