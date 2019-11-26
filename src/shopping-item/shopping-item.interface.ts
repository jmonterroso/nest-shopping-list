export interface IShoppingItem extends Document {
  _id?: string;
  name?: string;
  qty?: number;
  unitPrice?: number;
  price?: number;
}
