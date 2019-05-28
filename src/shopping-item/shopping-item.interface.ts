export interface IShoppingItem extends Document {
  readonly _id?: string;
  readonly name?:string;
  readonly price?: number;
}
