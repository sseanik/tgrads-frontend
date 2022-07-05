import {
  AspectRatio,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  CurrencyDollar,
  Location,
  Map2,
} from 'tabler-icons-react';

import AppShell from '../components/AppShell';
import Ticket from '../components/Ticket';
import { QUERY_SPECIFIC_EVENT } from '../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { EventAttributes } from '../types/Event';
import getDaysHoursMinutesRemaining from '../utils/getDaysHoursMinutesRemaining';
import { mapAndSortNames } from '../utils/mapAndSortNames';

interface UserDetails {
  codes: string[];
  cohort: string;
  firstName: string;
  lastName: string;
  plusOne: boolean;
  plusOneFirstName: string;
  plusOneLastName: string;
}

const Cruise: NextPage<{
  event: EventAttributes;
  names: string[];
}> = ({ event, names }) => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  const exportableTicket = useRef<HTMLDivElement>(null);
  const exportablePlusOneTicket = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const eventTime: Date = new Date(event.Date + ' ' + event.Time);
  const isEventOver: boolean = new Date() > eventTime;
  const { days, hours, minutes } = getDaysHoursMinutesRemaining(eventTime);

  useEffect(() => {
    if (session == null) {
      setUserDetails(undefined);
    } else {
      setIsLoading(true);
      fetch(
        process.env.NODE_ENV === 'production'
          ? 'https://tgrads.vercel.app'
          : 'http://localhost:3000',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setIsLoading(false);
          setUserDetails(res);
        });
    }
  }, [session]);

  const handleDownloadImage = async (main = true) => {
    const { exportComponentAsPNG } = await import(
      'react-component-export-image'
    );
    exportComponentAsPNG(main ? exportableTicket : exportablePlusOneTicket, {
      fileName: `Sydney Cruise Ticket - ${
        main ? userDetails?.firstName : userDetails?.plusOneFirstName
      }`,
      html2CanvasOptions: {
        width: 770,
        height: 250,
        backgroundColor: null,
        scale: 2,
        windowWidth: 1000,
        windowHeight: 1000,
      },
    });
  };

  return (
    <AppShell names={names}>
      {isLoading && (
        <Box sx={{ display: 'flex' }}>
          <Text
            ml={10}
            size='xl'
            weight={700}
            color='gray'
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            Loading Tickets
            <Loader variant='dots' ml={6} mb={7} />
          </Text>
        </Box>
      )}
      {userDetails && (
        <Card shadow='sm' p='sm' mt={10}>
          {userDetails && (
            <Text mb={10} size='xl' weight={700} color='gray'>
              {`Your Ticket${userDetails.plusOne ? 's' : ''}:`}
            </Text>
          )}
          <Box
            sx={{
              display: 'flex',
              maxWidth: 1600,
              '@media (max-width: 1100px)': {
                flexDirection: 'column',
              },
            }}
          >
            {userDetails && (
              <Box
                sx={{
                  flex: '1',
                  marginRight: 20,
                  '@media (max-width: 1100px)': {
                    marginRight: 0,
                  },
                }}
              >
                <Ticket
                  ref={exportableTicket}
                  firstName={userDetails.firstName}
                  lastName={userDetails.lastName}
                  code={userDetails.codes[0]}
                  altColours={false}
                />
                <Button
                  color='indigo'
                  fullWidth
                  style={{ maxWidth: 770 }}
                  my={16}
                  onClick={() => handleDownloadImage()}
                >
                  {`Download ${userDetails.firstName}'s Ticket`}
                </Button>
              </Box>
            )}
            {userDetails && userDetails.plusOne && (
              <div style={{ flex: '1' }}>
                <Ticket
                  ref={exportablePlusOneTicket}
                  firstName={userDetails.plusOneFirstName}
                  lastName={userDetails.plusOneLastName}
                  code={userDetails.codes[1]}
                  altColours={true}
                />
                <Button
                  color='violet'
                  fullWidth
                  style={{ maxWidth: 770 }}
                  mt={16}
                  onClick={() => handleDownloadImage(false)}
                >
                  {`Download ${userDetails.plusOneFirstName}'s Ticket`}
                </Button>
              </div>
            )}
          </Box>
        </Card>
      )}
      <Card shadow='sm' p='sm' mt={10}>
        <Text mb={10} size='xl' weight={700} color='gray'>
          Event Details:
        </Text>

        <Text component='span'>
          {isEventOver ? 'Event finished ' : 'Event starts in: '}
        </Text>
        <Text component='span' size='lg' weight={700}>
          {isEventOver
            ? `${days} Days ago`
            : `${days} Days, ${hours} Hours, ${minutes} Minutes`}
        </Text>

        <Group my={20}>
          <Grid style={{ width: '100%' }}>
            <Grid.Col
              span={3}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <AspectRatio ratio={1 / 1} sx={{ width: 60 }}>
                <div
                  style={{
                    background: '#43b2e9',
                    borderRadius: '5px',
                    padding: 5,
                    border: '2px solid black',
                  }}
                >
                  {event.GoogleMapsURL ? (
                    <Map2 size={36} strokeWidth={2} color={'#fff'} />
                  ) : (
                    <Location size={36} strokeWidth={2} color={'#fff'} />
                  )}
                </div>
              </AspectRatio>
              <Text
                mt={10}
                weight={600}
                align='center'
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.sm,
                  },
                })}
                variant={event.GoogleMapsURL ? 'link' : 'text'}
                component={event.GoogleMapsURL ? 'a' : 'span'}
                href={event.GoogleMapsURL ?? ''}
              >
                {event.Location}
              </Text>
              <Text
                sx={(theme) => ({
                  fontSize: theme.fontSizes.sm,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.xs,
                  },
                })}
                align='center'
              >
                {event.Suburb}
              </Text>
            </Grid.Col>
            <Grid.Col
              span={3}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AspectRatio ratio={1 / 1} sx={{ width: 60 }}>
                <div
                  style={{
                    background: '#e5832a',
                    borderRadius: '5px',
                    padding: 5,
                    border: '2px solid black',
                  }}
                >
                  <Calendar size={36} strokeWidth={2} color={'#fff'} />
                </div>
              </AspectRatio>
              <Text
                mt={10}
                weight={600}
                align='center'
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.sm,
                  },
                })}
              >
                {eventTime.toDateString().slice(0, -5)}
              </Text>
              <Text
                sx={(theme) => ({
                  fontSize: theme.fontSizes.sm,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.xs,
                  },
                })}
              >
                Date
              </Text>
            </Grid.Col>
            <Grid.Col
              span={3}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AspectRatio ratio={1 / 1} sx={{ width: 60 }}>
                <div
                  style={{
                    background: '#95c44d',
                    borderRadius: '5px',
                    padding: 5,
                    border: '2px solid black',
                  }}
                >
                  <Clock size={36} strokeWidth={2} color={'#fff'} />
                </div>
              </AspectRatio>
              <Text
                mt={10}
                weight={600}
                align='center'
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.sm,
                  },
                })}
              >
                {event.Time}
              </Text>
              <Text
                sx={(theme) => ({
                  fontSize: theme.fontSizes.sm,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.xs,
                  },
                })}
              >
                Time
              </Text>
            </Grid.Col>
            <Grid.Col
              span={3}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AspectRatio ratio={1 / 1} sx={{ width: 60 }}>
                <div
                  style={{
                    background: '#ed3693',
                    borderRadius: '5px',
                    padding: 5,
                    border: '2px solid black',
                  }}
                >
                  <CurrencyDollar size={36} strokeWidth={2} color={'#fff'} />
                </div>
              </AspectRatio>
              <Text
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.sm,
                  },
                })}
                mt={10}
                weight={600}
                align='center'
              >
                {event.Cost === '$' ? 'BYO' : event.Cost}
              </Text>
              <Text
                sx={(theme) => ({
                  fontSize: theme.fontSizes.sm,
                  '@media (max-width: 550px)': {
                    fontSize: theme.fontSizes.xs,
                  },
                })}
              >
                Price
              </Text>
            </Grid.Col>
          </Grid>
        </Group>
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: {
      events: { data },
    },
  } = await client.query({
    query: QUERY_SPECIFIC_EVENT,
    variables: { slug: 'sydney-cruise-party' },
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads);

  return {
    props: { event: data[0].attributes, names: names },
  };
};

export default Cruise;
