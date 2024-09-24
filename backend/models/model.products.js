import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    documento: {
        type: String,
        required: true
    }
})

const productsList = mongoose.model('products', productsSchema);
export default productsList;