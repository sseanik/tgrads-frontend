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
};
interface GalleryPhotos {
  data: GalleryPhoto[];
}

export type GalleryPhoto = {
  id: string;
  attributes: {
    alternativeText: string;
    caption: string;
    height: number;
    width: number;
    name: string;
    url: string;
  };
};

export interface ParsedPhoto {
  id: string;
  alternativeText: string;
  description?: string;
  height: number;
  width: number;
  name: string;
  src: string;
}

export type GalleryPhotoReduced = {
  attributes: {
    url: string;
  };
};

export type FaceDetectionResponse = {
  outputs: {
    data: {
      regions: FaceDetectionRegion[];
    };
  }[];
};

export type FaceDetectionRegion = {
  region_info: {
    bounding_box: {
      top_row: number;
      left_col: number;
      right_col: number;
      bottom_row: number;
    };
  };
};
