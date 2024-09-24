import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
   /* fechaFabric: {
        type: String,
        required: true
    },
    fechaExpiacion : {
        type: String,
        required: true
    },
    loteFabricacion: {
        type: String,
        required: true
    },*/
    documento: {
        type: String,
        required: true
    }
})

const productsList = mongoose.model('products', productsSchema);
export default productsList;