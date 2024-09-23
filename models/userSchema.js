import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide user's name"],
    maxLength: 100,
    minLength: 2,
  },
  email: {
    type: String,
    required: [true, "Please provide user's email address"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address"
    }
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 10,
  },
  role: {
    type:String,
    enum:['admin', 'user'],
    default:'user'
  },
  emailVerificationToken: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedDate: {
    type: Date
  },
  restPasswordToken: {
    type: String,
  },
  restPasswordTokenExp: {
    type: Date,
  },
});

// use function inseated of arrow funtion to keep the scope with this schema
userSchema.pre("save", async function () {
  // should ignore if the password is not updated.
  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
