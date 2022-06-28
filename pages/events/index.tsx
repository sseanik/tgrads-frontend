import { GetStaticProps, NextPage } from 'next';

import AppShell from '../../components/AppShell';
import EventsDisplay from '../../components/EventsDisplay';
import { fetchAPI } from '../../lib/api';
import { Event } from '../../types/Event';
import upcomingDate from '../../utils/isUpcomingDate';

const Events: NextPage<{ events: Event[] }> = ({ events }) => {
  const extractSpecificEvents = (events: Event[], upcoming: boolean) => {
    return events
      .filter((event: Event) => upcomingDate(event.attributes.Date, upcoming))
      .sort((a: Event, b: Event) =>
        new Date(a.attributes.Date) < new Date(b.attributes.Date)
          ? upcoming
            ? -1
            : 1
          : upcoming
          ? 1
          : -1
      );
  };

  const upcomingEvents = extractSpecificEvents(events, true);
  const pastEvents = extractSpecificEvents(events, false);

  return (
    <AppShell>
      <EventsDisplay events={upcomingEvents} title='Upcoming Events' />
      <EventsDisplay events={pastEvents} title='Past Events' />
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const eventResponse = await fetchAPI('events', {
    populate: ['Image'],
  });

  return {
    props: { events: eventResponse.data },
    revalidate: 1,
  };
};

export default Events;
