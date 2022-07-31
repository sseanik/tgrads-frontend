import { AspectRatio, Box, Button, Card, Loader, Text } from '@mantine/core';
import { toPng } from 'html-to-image';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Login, Logout, Speedboat } from 'tabler-icons-react';

import { getDetailSegments } from '../../assets/getDetailSegments';
import { homeNavItems } from '../../assets/navItem';
import LoginModalCruise from '../../components/Modal/LoginModalCruise';
import AppShell from '../../components/Navigation/AppShell';
import Ticket from '../../components/Ticket';
import { QUERY_SPECIFIC_EVENT } from '../../graphql/queries/events';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';
import { UserDetails } from '../../types/Cruise';
import { EventAttributes } from '../../types/Event';
import { Grad } from '../../types/User';
import { getDaysHoursMinutesRemaining } from '../../utils/dateAndTimeUtil';

interface CruiseProps {
  event: EventAttributes;
  grads: Grad[];
}

const RESPONSIVE_WIDTH = '@media (max-width: 1100px)'

const Cruise: NextPage<CruiseProps> = ({ event, grads }) => {
  // Check session if user is logged in
  const { data: session } = useSession();
  // Save the ticket details of the purchaser
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  // Ticket Refs for export purposes
  const exportableTicket = useRef<HTMLDivElement>(null);
  const exportablePlusOneTicket = useRef<HTMLDivElement>(null);
  // Loading state when checking for user details
  const [isLoading, setIsLoading] = useState(false);
  // Add the event time onto the event date
  const eventTime: Date = new Date(event.Date + 'T18:15');
  // Boolean to see if event is over
  const isEventOver: boolean = new Date() > eventTime;
  // The amount of days and hours until the event starts
  const { days, hours } = getDaysHoursMinutesRemaining(eventTime);
  // The modal state of the login cruise modal
  const [openedCruise, setOpenedCruise] = useState<boolean>(false);
  // Get the static coloured icon detail segments
  const detailSegments = getDetailSegments(isEventOver, days, hours);

  useEffect(() => {
    // If user is not logged in
    if (session == null) {
      setUserDetails(undefined);
    } else if (userDetails !== undefined) {
      return;
    } else {
      setIsLoading(true);
      // Fetch the user details using the saved JWT
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

  // Function to handle downloading ticket as an image
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

  return (
    <AppShell grads={grads} navItems={homeNavItems}>
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
            <Text mb={10} size='xl' weight={700}>
              {`Your Ticket${userDetails.plusOne ? 's' : ''}:`}
            </Text>
          )}
          <Box
            sx={{
              display: 'flex',
              maxWidth: 1600,
              [RESPONSIVE_WIDTH]: {
                flexDirection: 'column',
              },
            }}
          >
            {userDetails && (
              <Box
                sx={{
                  flex: '1',
                  marginRight: 20,
                  [RESPONSIVE_WIDTH]: {
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
                    size={+detail.footnote.size ?? undefined}
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

  return {
    props: { event: data[0].attributes, grads: grads.data },
  };
};

export default Cruise;
