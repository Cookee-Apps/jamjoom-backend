import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('uploads')
export class UploadsController {
  private readonly s3BaseUrl = process.env.AWS_S3_BASE_URL

  // @Get('*path')
  // redirectToS3(@Param() params: { path: string[] }, @Res() res: Response) {
  //   if (!params.path || params.path.length === 0) {
  //     return res.status(404).send('Not Found');
  //   }

  //   // Encode each path segment safely
  //   const encodedPath = params.path
  //     .map(p => encodeURIComponent(p))
  //     .join('/');

  //   const redirectUrl = `${this.s3BaseUrl}/${encodedPath}`;
  //   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  //   return res.redirect(302, redirectUrl);
  // }

}
