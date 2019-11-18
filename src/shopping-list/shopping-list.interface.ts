import { IShoppingItem } from '../shopping-item/shopping-item.interface';

export interface IShoppingList extends Document {
  readonly _id?: string;
  readonly name?: string;
  readonly budget?: number;
  readonly items?: [IShoppingItem];
  readonly total?: number;
}
