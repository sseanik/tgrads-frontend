import { GetStaticProps, NextPage } from 'next';
import AppShell from '../../components/AppShell';
import { fetchAPI } from '../../lib/api';
import { attributes } from './[slug]';
import EventsDisplay from '../../components/EventsDisplay';

interface event {
  attributes: attributes;
  id: number;
}

const Events: NextPage<{ events: event[] }> = ({ events }) => {
  const upcomingDate = (dateStr: string, upcoming = true) => {
    const check = new Date() < new Date(dateStr);
    return upcoming ? check : !check;
  };

  const extractSpecificEvents = (events: any, upcoming: boolean) => {
    return events
      .filter((event: any) => upcomingDate(event.attributes.Date, upcoming))
      .sort((a: any, b: any) =>
        new Date(a.attributes.Date) < new Date(b.attributes.Date) ? -1 : 1
      );
  };

  const upcomingEvents = extractSpecificEvents(events, true);
  const pastEvents = extractSpecificEvents(events, false);

  return (
    <AppShell>
      <EventsDisplay events={upcomingEvents} upcomingDate={upcomingDate} title="Upcoming Events"/>
      <EventsDisplay events={pastEvents} upcomingDate={upcomingDate} title="Past Events"/>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const eventResponse = await fetchAPI('events', {
    populate: ['Image'],
  });

  return {
    props: { events: eventResponse.data },
    revalidate: 1,
  };
};

export default Events;
