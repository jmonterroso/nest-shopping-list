import * as mongoose from 'mongoose';

export const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  deletedAt: {
    type: Date,
  },
}, { timestamps: true });
