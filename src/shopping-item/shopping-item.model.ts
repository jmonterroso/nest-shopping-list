import * as mongoose from 'mongoose';

export const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  price: {
    type: Number,
    required: false,
  },
  unitPrice: Number,
  qty: {
    type: Number,
    default: 1,
  },
  deletedAt: {
    type: Date,
  },
}, { timestamps: true });

