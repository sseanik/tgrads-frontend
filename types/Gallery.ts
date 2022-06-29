import { Event } from './Event';

export interface Gallery {
  attributes: GalleryAttributes;
}

export type GalleryAttributes = {
  Event: {
    data: Event;
  };
  FeaturedPhotos: GalleryPhotos;
  Photos: GalleryPhotos;
  Recap: string;
}
interface GalleryPhotos {
  data: GalleryPhoto[];
}

type GalleryPhoto = {
  attributes: {
    alternativeText: string;
    caption: string;
    height: number;
    width: number;
    name: string;
    url: string;
  };
};

export type GalleryPhotoReduced = {
  attributes: {
    url: string;
  };
};
