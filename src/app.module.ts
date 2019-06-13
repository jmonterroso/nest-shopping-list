import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingItemModule } from './shopping-item/shopping-item.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

@Module({
  // imports: [MongooseModule.forRoot('mongodb://ad:X3l4ju.mc@ds211558.mlab.com:11558/4geeks'), ShoppingListModule],
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    ShoppingItemModule, ShoppingListModule,
    MongooseModule.forRoot('mongodb://ad:X3l4ju.mc@ds211558.mlab.com:11558/4geeks'),
    // MongooseModule.forRoot('mongodb://localhost/lista'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
