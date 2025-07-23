import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateTenantDoc, GetTenantDoc } from './tenants.swagger';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { FindTenantsDto } from './dto/find-tenants.dto';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
// import { multerUploadConfig } from '../../infrastructure/image/multer-upload.config';
// import {
//   MediaUploadDto,
//   MediaUploadsDto,
// } from 'src/infrastructure/image/dto/media-upload.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @GetTenantDoc()
  findAll(@Query() findAllTenantsDto: FindTenantsDto) {
    const results = this.tenantsService.findAll(findAllTenantsDto);
    return results;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const results = this.tenantsService.findOne(+id);
    return results;
  }

  // TODO: add sub-resource routing e.g. (@Get(':id/something')) such as for image, pfp

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', multerUploadConfig))
  // upload(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() metadata: MediaUploadDto,
  // ) {
  //   return this.tenantsService.upload({
  //     ...metadata,
  //     file,
  //   });
  // }

  // TODO:
  // @Post('uploads')
  // @UseInterceptors(FilesInterceptor('files', 10, multerUploadConfig))
  // uploads(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() metadata: MediaUploadsDto,
  // ) {
  //   if (!files || files.length === 0) {
  //     return 'No files provided';
  //   }
  //   return this.tenantsService.uploads({
  //     ...metadata,
  //     files,
  //   });
  // }

  @Post()
  @CreateTenantDoc()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    const result = this.tenantsService.update(+id, updateTenantDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const castedId = Number(id);
    return this.tenantsService.remove(castedId);
  }
}
