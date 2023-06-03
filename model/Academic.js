import mongoose from "mongoose";

const GradeSchema = mongoose.Schema({
    subject: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    }
  });


const AcademicSchema = mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      file: {
        data: Buffer,
        contentType: String
    },
    
}, { timestamps: true })

export const Academic = mongoose.model("Academic", AcademicSchema);