import { AspectRatio, Box, Button, Card, Loader, Text } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { BiWine } from 'react-icons/bi';
import { GiLargeDress, GiMeal } from 'react-icons/gi';
import { Calendar, Clock, CurrencyDollar, Map2 } from 'tabler-icons-react';

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
  const [isLoading, setIsLoading] = useState(false);
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
          ? 'https://tgrads.vercel.app/api/user/me'
          : 'http://localhost:1337/api/users/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          setUserDetails(res);
        })
        .catch((e) => console.log(e));
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#43b2e9',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <Map2 size={50} strokeWidth={2} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Location:
            </Text>
            <Text
              size='md'
              variant={'link'}
              component={'a'}
              href={event.LocationURL}
            >
              {event.Location}
            </Text>
            <Text size='sm'>{event.Suburb}</Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#e5832a',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <Calendar size={50} strokeWidth={2} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Date:
            </Text>

            <Text size='md'>
              {eventTime.toLocaleDateString('en-au', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <Text size='sm'>
              Countdown:{' '}
              {isEventOver
                ? `${days} Days ago`
                : `${days} Days, ${hours} Hours, ${minutes} Minutes`}
            </Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#95c44d',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <Clock size={50} strokeWidth={2} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Time:
            </Text>
            <Text size='md'>Start - 6:30pm</Text>
            <Text size='md'>End - 10:30pm</Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#ed3693',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <CurrencyDollar size={50} strokeWidth={2} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Price:
            </Text>
            <Text size='md'>$109 for all NSW grads</Text>
            <Text size='md'>$99 for interstate grads</Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#9e61ff',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <GiLargeDress size={50} strokeWidth={2} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Dress Code:
            </Text>
            <Text size='md'>Cocktail</Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#ff665b',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <GiMeal size={46} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Food:
            </Text>
            <Text size='md'>Food from the cocktail menu</Text>
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '16px',
            flex: 1,
          }}
        >
          <AspectRatio ratio={1 / 1} sx={{ width: 80, marginRight: '16px' }}>
            <div
              style={{
                background: '#5a71e8',
                borderRadius: '5px',
                padding: 5,
                border: '2px solid black',
              }}
            >
              <BiWine size={46} color={'#fff'} />
            </div>
          </AspectRatio>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text size='lg' weight={600}>
              Drinks:
            </Text>
            <Text size='md'>
              Unlimited selected beer, wine, and soft drinks
            </Text>
            <Text size='sm'>Other drinks can be purchased at the bar</Text>
          </Box>
        </div>
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
