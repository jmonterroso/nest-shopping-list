import * as mongoose from 'mongoose';

export const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  unitPrice: Number,
  qty: {
    type: Number,
    default: 1,
  },
  deletedAt: {
    type: Date,
  },
}, { timestamps: true });

ShoppingItemSchema.pre('save', function(next) {
  this.unitPrice = this.price;
  this.price = this.price * this.qty;
  next();
});
