import mongoose from "mongoose";

const Schema = mongoose.Schema;

const verifiedSchema = new Schema({
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
        ref : "User",
        required: true
    },
    verified_at: {
        type: Date,
        required: true
    },
    sample_file: {
        data: Buffer,
        contentType: String
    },
    full_file: {
        data: Buffer,
        contentType: String
    },
})

export const Verified = mongoose.model("Verified", verifiedSchema); 