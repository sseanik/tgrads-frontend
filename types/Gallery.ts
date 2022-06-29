import { Event } from './Event';

export interface Gallery {
  attributes: GalleryAttributes;
}

export interface GalleryAttributes {
  Event: GalleryEvent[];
  FeaturedPhotos: GalleryPhotos;
}

type GalleryEvent = {
  event: {
    data: Event;
  }
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
  }
}

export type GalleryPhotoReduced = {
  attributes: {
    url: string;
  }
}
