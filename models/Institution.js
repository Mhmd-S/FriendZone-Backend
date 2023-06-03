import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InstitutionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['University', 'College', 'School', 'Other'],
    },
    address: {
        type: [Schema.types.ObjectId],
        ref: "Course",
        required: true
    },
    courses: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        require: true,
    },
    agents: {
        type: [Schema.types.ObjectId],
        required: true,
        ref: "Agent",
    }
}, { timestamps: true });

export const Institution = mongoose.model("Institution", InstitutionSchema);