export interface Event {
  id: number;
  attributes: EventAttributes;
}

export interface EventAttributes {
  Title: string;
  Description: string;
  Date: string;
  Time: string;
  Location: string;
  Suburb: string;
  GoogleMapsURL: string;
  Footnote: string;
  Image: EventImage;
  Cost: number;
  Slug: string;
}

export type EventImage = {
  data: {
    attributes: {
      alternativeText: string;
      caption: string;
      height: number;
      width: number;
      url: string;
    };
  };
};
