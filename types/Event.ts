export interface Event {
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
  Cost: string;
  Slug: string;
  Image?: EventImage;
}

type EventImage = {
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
