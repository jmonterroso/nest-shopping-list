import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ShoppingItemService } from './shopping-item.service';
import { IShoppingItem } from './shopping-item.interface';

@Controller('shopping-item')
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {

  }

  @Get()
  async findAll(args): Promise<any> {
    return await this.shoppingItemService.paginate({...args}).toPromise();
  }

  @Post()
  async create(@Body() item: IShoppingItem): Promise<IShoppingItem> {
    return await this.shoppingItemService.create(item);
  }

  @Put(':id')
  async update(@Param('id')id: string, @Body() item: IShoppingItem): Promise<IShoppingItem> {
    return await this.shoppingItemService.update(id, item);
  }

  @Delete(':id')
  async delete(@Param('id')id: string) {
    return await this.shoppingItemService.removeById(id);
  }

}
