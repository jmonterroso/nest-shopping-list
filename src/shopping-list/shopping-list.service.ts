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
      .populate({ path: 'items', options: { sort: { updatedAt: -1 } } });
  }

  calculateTotal(items) {
    if (!items.length) {
      return 0;
    }
    return items.reduce((sum, agg) => sum + agg.price || 0, 0);
  }

  async addToList(id, item) {
    const list = await this.shoppingListItem.findById(id).populate('items', 'price');
    item.price = item.unitPrice * item.qty;
    const product = await this.shoppingItemService.create(item);
    list.items.push(product);
    list.total = this.calculateTotal(list.items);
    return list.save();
  }

  async removeFromList(id, itemId) {
    const list = await this.shoppingListItem.findByIdAndUpdate(Types.ObjectId(id), {
      $pull: { items: itemId },

    }, { new: true }).populate('items', 'price');
    await this.shoppingItemService.removeById(Types.ObjectId(itemId));
    list.total = this.calculateTotal(list.items);
    list.save();
    return list;
  }

  async updateItemFromList(id, itemId, item) {
    item.price = item.unitPrice * item.qty;
    await this.shoppingItemService.update(itemId, item);
    const list = await this.findOne(id);
    list.total = this.calculateTotal(list.items);
    await list.save();
    return list;
  }

}
