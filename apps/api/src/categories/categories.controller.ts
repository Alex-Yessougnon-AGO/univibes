import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Liste des cat\u00e9gories',
    description: 'Retourne toutes les cat\u00e9gories d\'\u00e9v\u00e9nements avec le nombre d\'\u00e9v\u00e9nements par cat\u00e9gorie.',
  })
  @ApiResponse({ status: 200, description: 'Liste des cat\u00e9gories' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: "D\u00e9tails d'une cat\u00e9gorie",
    description: "Retourne une cat\u00e9gorie avec ses \u00e9v\u00e9nements approuv\u00e9s.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la cat\u00e9gorie' })
  @ApiResponse({ status: 200, description: 'Cat\u00e9gorie avec ses \u00e9v\u00e9nements' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }
}
