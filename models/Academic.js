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
    academic_name: {
        type: String,
        enum: ["STP", "STPM", "UEC", "O Level", "A Level", "IB", "Certificate", "Diploma", "Degree", "Masters", "PhD"],
        required: true
      },
      results: {
        grades: [GradeSchema],
        required: true,
      },
      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      file: {
        data: Buffer,
        contentType: String
    },
    
}, { timestamps: true })

export const Academic = mongoose.model("Academic", AcademicSchema);