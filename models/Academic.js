import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    subject: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    }
});

const AcademicSchema = new Schema({
    academicName: {
        type: String,
        enum: ["STP", "STPM", "UEC", "O Level", "A Level", "IB", "Certificate", "Diploma", "Degree", "Masters", "PhD"],
        required: true,
      },
      results: {
        type: [GradeSchema],
        required: true,
      },
      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
      },
      file: {
        type: Schema.Types.Buffer,
        data: Buffer,
        contentType: String,
        required: true,
      },
    
}, { timestamps: true })

const Academic = mongoose.model("Academic", AcademicSchema);
export default Academic; 