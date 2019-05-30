import * as mongoose from 'mongoose';

export const ShoppingListSchema = new mongoose.Schema({
  name: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingItem' }],
  deletedAt: {
    type: Date,
  },
  total: {
    type: Number,
  },
}, { timestamps: true });


