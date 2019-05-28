import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { IShoppingList } from './shopping-list.interface';
import { IShoppingItem } from '../shopping-item/shopping-item.interface';
import { Model, Document, Types } from 'mongoose';
@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {

  }

  @Get()
  async findAll(args): Promise<any> {
    return await this.shoppingListService.paginate({...args}).toPromise();
  }

  @Get(':id')
  async findById(@Param('id')id: string): Promise<any> {
    return this.shoppingListService.findOne(id) ;
    return await this.shoppingListService.findOneById(id);
  }

  @Post()
  async create(@Body() item: IShoppingList): Promise<IShoppingList> {
    return await this.shoppingListService.create(item);
  }

  @Put(':id')
  async update(@Param('id')id: string, @Body() item: IShoppingList): Promise<IShoppingList> {
    return await this.shoppingListService.update(id, item);
  }

  @Delete(':id')
  async delete(@Param('id')id: string) {
    return await this.shoppingListService.removeById(id);
  }

  @Post(':id')
  async addToList(@Param('id')id: string, @Body() item: IShoppingItem) {
    return await this.shoppingListService.addToList(id, item);
  }
  @Delete(':id/item/:itemId')
  async removeFromList(@Param('id') id: string, @Param('itemId') itemId: string) {
    return await this.shoppingListService.removeFromList(id, itemId);
  }

}
