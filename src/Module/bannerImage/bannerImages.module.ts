import { Module } from '@nestjs/common';
import { BannerImagesService } from './bannerImages.service';
import { BannerImagesProvider } from './bannerImages.providers';
import { BannerImagesController } from './bannerImages.controller';

@Module({
  controllers: [BannerImagesController],
  providers: [BannerImagesService, ...BannerImagesProvider],
})
export class BannerImagesModule {}
