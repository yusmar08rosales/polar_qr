import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: false,
  },
  codigo: {
    verificationCode: String,
    codeExpiration: Date,
  },
  inicio: {
    type: Boolean,
    required: false,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  verificationAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Date
  }
});

// Método para verificar si el usuario está bloqueado
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

const User = mongoose.model('User', userSchema);
export default User;
