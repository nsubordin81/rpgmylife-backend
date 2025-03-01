import {mongoose} from 'mongoose.js';

const StoreItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
    }, {
    timestamps: true
    });
   
export const StoreItem = mongoose.model('StoreItem', StoreItemSchema);