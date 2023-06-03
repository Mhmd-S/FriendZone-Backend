import mongoose from "mongoose";

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
        type: [mongoose.Schema.types.ObjectId],
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
        type: [mongoose.Schema.types.ObjectId],
        required: true,
        ref: "Agent",
    }
}, { timestamps: true });

export const Institution = mongoose.model("Institution", InstitutionSchema);