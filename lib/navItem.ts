import { CalendarEvent, Icon, Photo, Speedboat } from 'tabler-icons-react';

export interface NavItems {
  url: string;
  text: string;
  icon?: Icon;
  title: string;
}

export interface NavMenu {
  common: NavItems[];
  nsw?: NavItems[];
  vic?: NavItems[];
  qld?: NavItems[];
  sa?: NavItems[];
  act?: NavItems[];
  wa?: NavItems[];
}

export const navItems = {
  common: [
    {
      url: 'events',
      text: 'Events',
      icon: CalendarEvent,
      title: 'Events Calendar',
    },
    { url: 'gallery', text: 'Gallery', icon: Photo, title: 'Photo Gallery' },
  ],
  nsw: [
    { url: 'cruise', text: 'Cruise', icon: Speedboat, title: 'Cruise Party' },
  ],
};

export const homeNavItems = {
  common: [
    { url: 'nsw/events', text: 'NSW', title: 'New South Wales' },
    { url: 'vic/events', text: 'VIC', title: 'Victoria' },
    { url: 'qld/events', text: 'QLD', title: 'Queensland' },
    { url: 'sa/events', text: 'SA', title: 'South Australia' },
    {
      url: 'act/events',
      text: 'ACT',
      title: 'Australian Capital Territory',
    },
    { url: 'wa/events', text: 'WA', title: 'Western Australia' },
  ],
};
