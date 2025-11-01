import { JobStatus, Priority } from "@/lib/constants";
import mongoose, { Schema, model, Document, Model, Types } from "mongoose";

export interface IJob extends Document {
  userId: Types.ObjectId;
  companyName: string;
  role: string;
  dateApplied: Date;
  status: JobStatus;
  notes?: string;
  salaryRange?: string;
  location?: string;
  link?: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    dateApplied: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.APPLIED,
      required: true,
      index: true,
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      required: true,
      index: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.index({ userId: 1, status: 1, dateApplied: -1 });

const Job: Model<IJob> = mongoose.models.Job || model<IJob>("Job", jobSchema);
export default Job;
