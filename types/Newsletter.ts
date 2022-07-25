export type Newsletter = {
  attributes: {
    Title: string;
    Slug: string;
    FirstDayOfMonth: string;
    Description: string;
    StateBlurbs: StateBlurb[];
    EventBlurbs: EventBlurb[];
    CalendarTable: CalendarTable;
    Gif: string;
  }
}

export type StateBlurb = {
  State: "NSW" | "QLD" | "SA" | "TAS" | "VIC" | "WA";
  Description: string;
  Photos: {
    data: Photo[];
  }
}

export type EventBlurb = {
  Title: string
  Description: string;
  Photos: {
    data: Photo[];
  }
}

export interface CalendarTable {
  State: "All" | "NSW" | "QLD" | "SA" | "TAS" | "VIC" | "WA",
  Event: string,
  Date: string,
  Time?: string,
}

type Photo = {
  attributes: {
    name: string;
    url: string;
    caption: string;
    alternativeText: string;
    height: number;
    width: number;
  }
}