import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      default: 'admin',
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Match password (supports bcrypt hash and plain initial fallback)
adminSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return enteredPassword === this.password;
};

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
