// @ts-nocheck
/* eslint-disable */
/* eslint-disable no-unused-vars, no-console */

// ? Usage in Controller Layer ?
/*
* @Post('upload')
* @UseInterceptors(FileInterceptor('file', multerUploadConfig))
* upload(
*   @UploadedFile() file: Express.Multer.File,
*   @Body() metadata: MediaUploadDto,
* ) {
*   return this.tenantsService.upload({
*     ...metadata,
*     file,
*   });
* }
*/

/*
*@Post('uploads')
*@UseInterceptors(FilesInterceptor('files', 10, multerUploadConfig))
*uploads(
*  // @UploadedFiles() files: Express.Multer.File[],
*  // @Body() metadata: MediaUploadsDto,
*) {
*  if (!files || files.length === 0) {
*    return 'No files provided';
*  }
*  return this.tenantsService.uploads({
*    ...metadata,
*    files,
*  });
*}
*/
// ? Usage in Controller Layer ?

// ? Usage in Service Layer ?
/*
* upload({ resourceType, resourceId, mediaType, file }: MediaUploadDto) {
*   const result = this.imageService.processUpload(
*     file,
*     resourceType,
*     resourceId,
*     mediaType,
*   );
* 
*   return result;
* }
*/

/*
* uploads({ resourceType, resourceId, mediaType, files }: MediaUploadsDto) {
*   if (!files || files.length === 0) {
*     throw new Error('No files provided');
*   }
*   const result = this.imageService.processUploads(
*     files,
*     resourceType,
*     resourceId,
*     mediaType,
*   );
* 
*   return result;
* }
*/

// ? Usage in Service Layer ?
