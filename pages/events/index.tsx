import { Text } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';

import AppShell from '../../components/AppShell';
import EventCard from '../../components/EventCard';
import { QUERY_ALL_EVENTS } from '../../graphql/queries/events';
import client from '../../lib/apollo';
import { Event } from '../../types/Event';
import upcomingDate from '../../utils/isUpcomingDate';

const Events: NextPage<{ events: Event[] }> = ({ events }) => {
  const extractSpecificEvents = (
    events: Event[],
    upcoming: boolean
  ): Event[] => {
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
      {upcomingEvents.length > 0 && (
        <Text ml={10} size='xl' weight={700} color='gray'>
          Upcoming Events
        </Text>
      )}
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
  const {
    data: {
      events: { data },
    },
  } = await client.query({
    query: QUERY_ALL_EVENTS,
  });

  return {
    props: { events: data },
  };
};

export default Events;
