import { Text } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';

import EventCard from '../../components/EventCard';
import AppShell from '../../components/Navigation/AppShell';
import { QUERY_ALL_EVENTS } from '../../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';
import { Event } from '../../types/Event';
import upcomingDate from '../../utils/isUpcomingDate';
import { mapAndSortNames } from '../../utils/mapAndSortNames';

const Events: NextPage<{ events: Event[]; names: string[] }> = ({
  events,
  names,
}) => {
  const extractSpecificEvents = (
    events: Event[],
    upcoming: boolean
  ): Event[] => {
    return events
      .filter((event: Event) => upcomingDate(event.attributes.Date, upcoming))
      .sort((a: Event, b: Event) =>
        new Date(a.attributes.Date) <= new Date(b.attributes.Date)
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
    <AppShell names={names}>
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

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads)

  return {
    props: { events: data, names: names },
  };
};

export default Events;
