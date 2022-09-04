import { AspectRatio, Box, Button, Card, Loader, Text } from '@mantine/core';
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

import { homeNavItems } from '../../assets/navItem';
import LoginModalCruise from '../../components/Modal/LoginModalCruise';
import AppShell from '../../components/Navigation/AppShell';
import Ticket from '../../components/Ticket';
import { QUERY_CRUISE_EVENT } from '../../graphql/queries/cruise';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';
import { UserDetails } from '../../types/Cruise';
import { Grad } from '../../types/User';
import { getDaysHoursMinutesRemaining } from '../../utils/dateAndTimeUtil';

type BlurbSection = {
  Title: string;
  BlurbTitle: string;
  BlurbLink: string;
  FootnoteTitle: string;
  FootnoteSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  FootnoteLink: string | null;
  Colour: string;
  IconCheck: boolean;
};

type CruiseEvent = {
  Title: string;
  EventDetailsURL: string;
  DateTime: string;
  Blurb: BlurbSection[];
};
interface CruiseProps {
  event: CruiseEvent;
  grads: Grad[];
}

const RESPONSIVE_WIDTH = '@media (max-width: 1100px)';

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
  // The modal state of the login cruise modal
  const [openedCruise, setOpenedCruise] = useState<boolean>(false);
  // Convert string datetime into date object
  const parsedDateTime = new Date(event.DateTime);
  // The amount of days and hours until the event starts
  const { days, hours } = getDaysHoursMinutesRemaining(parsedDateTime);

  const iconMatch = (title: string, stroke: number | undefined) => {
    const iconObj = {
      Location: <Map2 size={50} color={'#fff'} strokeWidth={stroke} />,
      Date: <Calendar size={50} color={'#fff'} strokeWidth={stroke} />,
      Time: <Clock size={50} color={'#fff'} strokeWidth={stroke} />,
      Price: <CurrencyDollar size={50} color={'#fff'} strokeWidth={stroke} />,
      'Dress Code': (
        <GiLargeDress size={50} color={'#fff'} strokeWidth={stroke} />
      ),
      Food: <GiMeal size={50} color={'#fff'} strokeWidth={stroke} />,
      Drinks: <BiWine size={50} color={'#fff'} strokeWidth={stroke} />,
    };
    return iconObj[title];
  };

  const transformCountdownBlurb = (footnote: string) => {
    if (footnote !== 'Countdown:') return footnote;
    return `${footnote} ${days} days, ${hours} hours`;
  };

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
      {userDetails && userDetails.codes && (
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
        <Link href={event.EventDetailsURL}>
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
          {event.Blurb.map((blurb) => {
            return (
              <div
                key={blurb.Title}
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
                      background: blurb.Colour,
                      borderRadius: '5px',
                      padding: 5,
                      border: '2px solid black',
                    }}
                  >
                    {iconMatch(blurb.Title, blurb.IconCheck ? undefined : 2)}
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
                    {blurb.Title}
                  </Text>
                  <Text
                    size='md'
                    variant={blurb.BlurbLink ? 'link' : undefined}
                    component={blurb.BlurbLink ? 'a' : 'span'}
                    href={blurb.BlurbLink ? blurb.BlurbLink : undefined}
                    target='_blank'
                  >
                    {blurb.BlurbTitle}
                  </Text>
                  <Text
                    size={blurb.FootnoteSize ?? undefined}
                    variant={blurb.FootnoteLink ? 'link' : undefined}
                    component={blurb.FootnoteLink ? 'a' : 'span'}
                    href={blurb.FootnoteLink ? blurb.FootnoteLink : undefined}
                    target='_blank'
                  >
                    {transformCountdownBlurb(blurb.FootnoteTitle)}
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
      cruise: { data },
    },
  } = await client.query({
    query: QUERY_CRUISE_EVENT,
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  return {
    props: { event: data.attributes, grads: grads.data },
  };
};

export default Cruise;
