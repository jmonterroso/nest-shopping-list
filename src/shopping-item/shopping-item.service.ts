import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IShoppingItem } from './shopping-item.interface';
import { MongooseService } from '../mongoose-service';

@Injectable()
export class ShoppingItemService extends MongooseService<IShoppingItem> {
  constructor(@InjectModel('ShoppingItem') private readonly shoppingItemModel: Model<IShoppingItem>) {
    super(shoppingItemModel);
  }

}
