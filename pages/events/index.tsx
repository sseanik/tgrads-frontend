import { Text } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';

import AppShell from '../../components/AppShell';
import EventCard from '../../components/EventCard';
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
      <Text ml={10} size='xl' weight={700} color='gray'>
        Upcoming Events
      </Text>
      {upcomingEvents.map((event: Event) => {
        return <EventCard event={event} key={event.attributes.Slug} />;
      })}

      <Text ml={10} size='xl' weight={700} color='gray'>
        Past Events
      </Text>
      {pastEvents.map((event: Event) => {
        return <EventCard event={event} key={event.attributes.Slug} />;
      })}
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
