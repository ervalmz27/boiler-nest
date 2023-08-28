import { BANNER_IMAGE_PROVIDER } from '@/Helpers/contants';
import { BannerImage } from './entities/bannerImage.entity';

export const BannerImagesProvider = [
  {
    provide: BANNER_IMAGE_PROVIDER,
    useValue: BannerImage,
  },
];
