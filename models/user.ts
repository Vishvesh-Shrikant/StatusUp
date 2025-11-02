import mongoose, { Schema, model, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password?: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      select: false, // Never return password in queries
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
      lowercase: true, // industry standard: normalize emails
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/",
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: undefined,
  }
);

const User: Model<IUser> =
  mongoose.models.User || model<IUser>("User", userSchema);

export default User;
