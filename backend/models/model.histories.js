import mongoose from 'mongoose';

const historieSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    accion: {
        type: String,
        required: true
    },
    documento: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    dateFormat: {
        type: String,
        required: true
    }
})

const Histories = mongoose.model('histories', historieSchema);
export default Histories;