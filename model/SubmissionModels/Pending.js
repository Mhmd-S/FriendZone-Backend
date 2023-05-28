import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pendingSchema = new Schema({
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
    notifications: {
        type: [String],
        required: true
    },
});


export const Pending = mongoose.model("Pending", pendingSchema);
