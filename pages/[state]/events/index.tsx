import { Box, Text } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import EventCard from '../../../components/EventCard';
import AppShell from '../../../components/Navigation/AppShell';
import Breadcrumbs from '../../../components/Navigation/Breadcrumbs';
import { QUERY_STATE_EVENTS } from '../../../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import client from '../../../lib/apollo';
import { navItems } from '../../../lib/navItem';
import { Event } from '../../../types/Event';
import upcomingDate from '../../../utils/isUpcomingDate';
import { mapAndSortNames } from '../../../utils/mapAndSortNames';

const Events: NextPage<{ events: Event[]; names: string[] }> = ({
  events,
  names,
}) => {
  const router = useRouter();

  if (events.length === 0)
    return (
      <AppShell names={names} navItems={navItems}>
        <></>
      </AppShell>
    );

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

  const state = router.query.state as string;

  const crumbs = [
    { title: state.toUpperCase(), href: `/${state}/events` },
    { title: 'Events', href: `/${state}/events` },
  ];

  return (
    <AppShell names={names} navItems={navItems}>
      <Box
        style={{
          margin: '0 0 10px 10px',
        }}
      >
        <Breadcrumbs crumbs={crumbs} />
      </Box>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const state = context?.params?.state as string;
  const {
    data: {
      events: { data },
    },
  } = await client.query({
    query: QUERY_STATE_EVENTS,
    variables: { state: state.toUpperCase() },
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads);

  return {
    props: { events: data, names: names },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ['nsw', 'vic', 'qld', 'act', 'sa', 'wa', 'tas', 'nt'].map(
    (state: string) => {
      return { params: { state } };
    }
  );

  return {
    paths,
    fallback: false,
  };
};

export default Events;
