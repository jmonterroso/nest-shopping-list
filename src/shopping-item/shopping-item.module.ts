import { ShoppingItemSchema } from './shopping-item.model';
import { Module } from '@nestjs/common';
import { ShoppingItemController } from './shopping-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingItemService } from './shopping-item.service';
import { MongooseService } from '../mongoose-service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'ShoppingItem', schema: ShoppingItemSchema }])],
    controllers: [ShoppingItemController],
    providers: [ShoppingItemService, MongooseService],
    exports: [ShoppingItemService],
})
export class ShoppingItemModule { }
