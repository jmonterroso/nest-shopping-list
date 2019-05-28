import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IShoppingList } from './shopping-list.interface';
import { MongooseService } from '../mongoose-service';
import { ShoppingItemService } from '../shopping-item/shopping-item.service';
import { Document, Model, Types } from 'mongoose';

@Injectable()
export class ShoppingListService extends MongooseService<IShoppingList> {
  constructor(@InjectModel('ShoppingList') private readonly shoppingListItem: Model<IShoppingList>,
              private shoppingItemService: ShoppingItemService) {
    super(shoppingListItem);
  }

  async findOne(id) {
  return await this.shoppingListItem.findOne({ _id: Types.ObjectId(id), deletedAt: null })
    .populate('items');
  }
  async addToList(id, item) {
    const list = await this.shoppingListItem.findOneById(id);
    const product = await this.shoppingItemService.create(item);
    list.items.push(product);
    return await list.save();

  }
  async removeFromList(id, itemId) {
    const list = await this.shoppingListItem.findById(Types.ObjectId(id));
    const index = list.items.indexOf(itemId);
    if (index > -1) {
      list.items.splice(index, 1);
    }
    await this.shoppingItemService.removeById(Types.ObjectId(itemId));
    list.save();
    return list;

  }

}
