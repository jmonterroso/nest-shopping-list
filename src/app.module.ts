import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { ShoppingItemService } from './shopping-item/shopping-item.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';

@Module({
  // imports: [MongooseModule.forRoot('mongodb://ad:X3l4ju.mc@ds211558.mlab.com:11558/4geeks'), ShoppingListModule],
  imports: [
    ShoppingItemModule, ShoppingListModule,
    MongooseModule.forRoot('mongodb://ad:X3l4ju.mc@ds211558.mlab.com:11558/4geeks'),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
