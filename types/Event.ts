export interface Event {
  attributes: EventAttributes;
}

export interface EventAttributes {
  Title: string;
  State: "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";
  Description: string;
  Date: string;
  Time: string;
  Location: string;
  Suburb: string;
  LocationURL: string;
  Footnote: string;
  Cost: string;
  Slug: string;
  Image?: EventImage;
  RSVPURL: string;
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
