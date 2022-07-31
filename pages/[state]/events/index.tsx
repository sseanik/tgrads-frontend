import { Box, Text } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { navItems } from '../../../assets/navItem';
import { stateStrings } from '../../../assets/stateStrings';
import EventCard from '../../../components/EventCard';
import AppShell from '../../../components/Navigation/AppShell';
import Breadcrumbs from '../../../components/Navigation/Breadcrumbs';
import { QUERY_STATE_EVENTS } from '../../../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import client from '../../../lib/apollo';
import { Event } from '../../../types/Event';
import { Grad } from '../../../types/User';
import { isUpcomingDate } from '../../../utils/dateAndTimeUtil';

interface EventsProps {
  events: Event[];
  grads: Grad[];
}

const Events: NextPage<EventsProps> = ({ events, grads }) => {
  // Router to get the state from the url
  const router = useRouter();
  const state = router.query.state as string;

  // If there are no events, provide an empty app shell
  if (events.length === 0)
    return (
      <AppShell grads={grads} navItems={navItems}>
        <></>
      </AppShell>
    );

  // Split events into upcoming and past events based on their dates
  const extractSpecificEvents = (
    events: Event[],
    upcoming: boolean
  ): Event[] => {
    return events
      .filter((event: Event) => isUpcomingDate(event.attributes.Date, upcoming))
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

  const crumbs = [
    { title: state.toUpperCase(), href: `/${state}/events` },
    { title: 'Events', href: `/${state}/events` },
  ];

  return (
    <AppShell grads={grads} navItems={navItems}>
      <Box
        style={{
          margin: '0 0 10px 10px',
        }}
      >
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      {upcomingEvents.length > 0 && (
        <Text ml={10} size='xl' weight={700}>
          Upcoming Events
        </Text>
      )}
      {upcomingEvents.map((event: Event) => {
        return <EventCard event={event} key={event.attributes.Slug} />;
      })}

      <Text ml={10} size='xl' weight={700}>
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

  return {
    props: { events: data, grads: grads.data },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = stateStrings.map(
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
