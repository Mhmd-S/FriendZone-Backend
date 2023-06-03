import mongoose from "mongoose";

const AgentSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
    },
}, { timestamps: true })

export const Agent = mongoose.model("Agent", AgentSchema);