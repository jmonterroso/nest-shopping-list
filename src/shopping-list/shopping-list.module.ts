import { ShoppingListSchema } from './shopping-list.model';
import { Module } from '@nestjs/common';
import { ShoppingListController } from './shopping-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingListService } from './shopping-list.service';
import { MongooseService } from '../mongoose-service';
import { ShoppingItemService } from '../shopping-item/shopping-item.service';
import { ShoppingItemModule } from '../shopping-item/shopping-item.module';

@Module({
    imports: [
      ShoppingItemModule,
      MongooseModule.forFeature([{ name: 'ShoppingList', schema: ShoppingListSchema }])],
    controllers: [ShoppingListController],
    providers: [ShoppingListService, MongooseService, ShoppingItemService],
  exports: [ShoppingListService],
})
export class ShoppingListModule { }
