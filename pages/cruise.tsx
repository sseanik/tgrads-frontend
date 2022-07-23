import {
  AspectRatio,
  Box,
  Button,
  Card,
  Loader,
  MantineSize,
  Text,
} from '@mantine/core';
import { toPng } from 'html-to-image';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiWine } from 'react-icons/bi';
import { GiLargeDress, GiMeal } from 'react-icons/gi';
import {
  Calendar,
  Clock,
  CurrencyDollar,
  Login,
  Logout,
  Map2,
  Speedboat,
} from 'tabler-icons-react';

import LoginModalCruise from '../components/Modal/LoginModalCruise';
import AppShell from '../components/Navigation/AppShell';
import Ticket from '../components/Ticket';
import { QUERY_SPECIFIC_EVENT } from '../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { homeNavItems } from '../lib/navItem';
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

type EventDetail = {
  title: string;
  blurb: {
    title: string;
    link: string | null;
  };
  footnote: {
    title: string;
    size: MantineSize;
    link: string | null;
  };
  colour: string;
  icon: typeof Map2;
  iconCheck: boolean;
};

const Cruise: NextPage<{
  event: EventAttributes;
  names: string[];
}> = ({ event, names }) => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  // Tickets
  const exportableTicket = useRef<HTMLDivElement>(null);
  const exportablePlusOneTicket = useRef<HTMLDivElement>(null);
  //
  const [isLoading, setIsLoading] = useState(false);

  const eventTime: Date = new Date(event.Date + 'T18:15');
  const isEventOver: boolean = new Date() > eventTime;
  const { days, hours } = getDaysHoursMinutesRemaining(eventTime);
  // Cruise Modal
  const [openedCruise, setOpenedCruise] = useState<boolean>(false);

  useEffect(() => {
    if (session == null) {
      setUserDetails(undefined);
    } else if (userDetails !== undefined) {
      return;
    } else {
      setIsLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setIsLoading(false);
          setUserDetails(res);
        })
        .catch((e) => console.log(e));
    }
  }, [session, userDetails]);

  const onButtonClick = useCallback(
    (mainTicket = true) => {
      const selectedTicket = mainTicket
        ? exportableTicket
        : exportablePlusOneTicket;

      if (selectedTicket.current === null) {
        return;
      }

      const selectedName = mainTicket
        ? userDetails?.firstName
        : userDetails?.plusOneFirstName;

      toPng(selectedTicket.current, {
        cacheBust: true,
        pixelRatio: 3,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `SydneyCruiseTicket${selectedName}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [userDetails, exportableTicket, exportablePlusOneTicket]
  );

  const detailSegments: EventDetail[] = [
    {
      title: 'Location',
      blurb: {
        title: 'King St Wharf 3',
        link: 'https://www.google.com/maps/place/King+Street+Wharf+3/@-33.8668541,151.2000156,18z/data=!4m5!3m4!1s0x0:0xe3f07a964c511a7d!8m2!3d-33.8668167!4d151.2007484',
      },
      footnote: {
        title: 'Darling Harbour',
        size: 'sm',
        link: null,
      },
      colour: '#43b2e9',
      icon: Map2,
      iconCheck: false,
    },
    {
      title: 'Date',
      blurb: {
        title: 'Saturday, 3rd of September',
        link: null,
      },
      footnote: {
        title: `Countdown:
        ${isEventOver ? ` ${days} Days ago` : ` ${days} Days, ${hours} Hours`}`,
        size: 'sm',
        link: null,
      },
      colour: '#e5832a',
      icon: Calendar,
      iconCheck: false,
    },
    {
      title: 'Time',
      blurb: {
        title: 'Board at 6:15pm',
        link: null,
      },
      footnote: {
        title: 'Ends at 10:30pm',
        size: 'md',
        link: null,
      },
      colour: '#95c44d',
      icon: Clock,
      iconCheck: false,
    },
    {
      title: 'Price',
      blurb: {
        title: '$109 for all NSW Grads',
        link: null,
      },
      footnote: {
        title: '$99 for interstate Grads',
        size: 'md',
        link: null,
      },
      colour: '#ed3693',
      icon: CurrencyDollar,
      iconCheck: false,
    },
    {
      title: 'Dress Code:',
      blurb: {
        title: 'Cocktail',
        link: null,
      },
      footnote: {
        title: '',
        size: 'md',
        link: null,
      },
      colour: '#9e61ff',
      icon: GiLargeDress,
      iconCheck: false,
    },
    {
      title: 'Food:',
      blurb: {
        title: 'Food from the cocktail menu',
        link: null,
      },
      footnote: {
        title: 'See the food menu',
        size: 'sm',
        link: 'https://drive.google.com/file/d/1rrpp6xKHq8pmoJnSk2FCA-veXmrXYkPN/view?usp=sharing',
      },
      colour: '#ff665b',
      icon: GiMeal,
      iconCheck: true,
    },
    {
      title: 'Drinks:',
      blurb: {
        title: 'Unlimited beer, wine, soft drinks',
        link: null,
      },
      footnote: {
        title: 'See the drinks menu',
        size: 'sm',
        link: 'https://drive.google.com/file/d/1AHT8QX3HcMy8TLBWNp0XsfAUv3R13t2s/view?usp=sharing',
      },
      colour: '#5a71e8',
      icon: BiWine,
      iconCheck: true,
    },
  ];

  return (
    <AppShell names={names} navItems={homeNavItems}>
      <LoginModalCruise
        openedCruise={openedCruise}
        setOpenedCruise={setOpenedCruise}
      />

      {session ? (
        <Button
          rightIcon={<Logout />}
          onClick={() => signOut({ redirect: false })}
          variant='outline'
          color='indigo'
        >
          Ticket Logout
        </Button>
      ) : (
        <>
          <Button
            rightIcon={<Login />}
            onClick={() => setOpenedCruise(true)}
            variant='outline'
            color='indigo'
          >
            Ticket Login
          </Button>
          <Button
            ml={10}
            rightIcon={<Speedboat />}
            color='indigo'
            component='a'
            target='_blank'
            href='https://docs.google.com/forms/d/e/1FAIpQLSekaPjLC5JBvKdOUdKO5HOZwLhvKPgUWqqLIYPZrjyhH8mENA/viewform?usp=sf_link'
          >
            Buy Ticket
          </Button>
        </>
      )}
      {isLoading && (
        <Box sx={{ display: 'flex' }}>
          <Text
            mt={10}
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
                  onClick={() => onButtonClick()}
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
                  onClick={() => onButtonClick(false)}
                >
                  {`Download ${userDetails.plusOneFirstName}'s Ticket`}
                </Button>
              </div>
            )}
          </Box>
        </Card>
      )}
      <Card shadow='sm' p='sm' mt={10}>
        <Link href='/events/sydney-cruise-party'>
          <Text
            size='xl'
            weight={700}
            variant='link'
            component='a'
            color='indigo'
            style={{ cursor: 'pointer' }}
          >
            Event Details
          </Text>
        </Link>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
          {detailSegments.map((detail) => {
            return (
              <div
                key={detail.title}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexGrow: 0,
                  width: 320,
                }}
              >
                <AspectRatio
                  ratio={1 / 1}
                  sx={{ width: 70, marginRight: '16px' }}
                >
                  <div
                    style={{
                      background: detail.colour,
                      borderRadius: '5px',
                      padding: 5,
                      border: '2px solid black',
                    }}
                  >
                    <detail.icon
                      size={50}
                      strokeWidth={detail.iconCheck ? undefined : 2}
                      color={'#fff'}
                    />
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
                    {detail.title}
                  </Text>
                  <Text
                    size='md'
                    variant={detail.blurb.link ? 'link' : undefined}
                    component={detail.blurb.link ? 'a' : 'span'}
                    href={detail.blurb.link ? event.LocationURL : undefined}
                    target='_blank'
                  >
                    {detail.blurb.title}
                  </Text>
                  <Text
                    size={detail.footnote.size ?? undefined}
                    variant={detail.footnote.link ? 'link' : undefined}
                    component={detail.footnote.link ? 'a' : 'span'}
                    href={
                      detail.footnote.link ? detail.footnote.link : undefined
                    }
                    target='_blank'
                  >
                    {detail.footnote.title}
                  </Text>
                </Box>
              </div>
            );
          })}
        </Box>
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
