import mongoose from 'mongoose';

const embarqueSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    lote: {
        type: String,
        required: true
    },
    fechaEmbarque : {
        type: String,
        required: true
    },
    fechaDesembarque: {
        type: String,
        required: true
    },
    SENIAT: {
        type: String,
        required: true
    },
    origen: {
        type: String,
        required: true
    },
    embarque: {
        type: String,
        required: true
    }
})

const Embarque = mongoose.model('embarques', embarqueSchema);
export default Embarque;