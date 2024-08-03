import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  rol: {
    type: String,
    required: true
    }
});

const role = mongoose.model('roles', roleSchema);
export default role;