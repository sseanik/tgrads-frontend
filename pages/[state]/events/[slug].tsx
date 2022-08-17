import {
  AspectRatio,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  MediaQuery,
  ScrollArea,
  Text,
  useMantineTheme,
} from '@mantine/core';
import DOMPurify from 'isomorphic-dompurify';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Calendar,
  Clock,
  CurrencyDollar,
  Location,
  Map2,
} from 'tabler-icons-react';

import { navItems } from '../../../assets/navItem';
import AppShell from '../../../components/Navigation/AppShell';
import Breadcrumbs from '../../../components/Navigation/Breadcrumbs';
import {
  QUERY_EVENT_SLUGS,
  QUERY_SPECIFIC_EVENT,
} from '../../../graphql/queries/events';
import { QUERY_SPECIFIC_GALLERY } from '../../../graphql/queries/galleries';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import client from '../../../lib/apollo';
import { Event, EventAttributes } from '../../../types/Event';
import { Grad } from '../../../types/User';
import { getDaysHoursMinutesRemaining } from '../../../utils/dateAndTimeUtil';

interface EventsProps {
  event: EventAttributes;
  grads: Grad[];
  galleryAvailable: boolean;
}

const RESPONSIVE_WIDTH = '@media (max-width: 550px)';
const RESPONSIVE_WIDTH_TABLET = '@media (max-width: 735px)';

const Events: NextPage<EventsProps> = ({ event, grads, galleryAvailable }) => {
  // Use theme to check whether them is light or dark
  const theme = useMantineTheme();

  // Router used to get the state from the current URL
  const router = useRouter();
  const state = router.query.state as string;

  // Extract date and time information
  const eventTime: Date = new Date(event.Date + ' ' + event.Time);
  const isEventOver: boolean = new Date() > eventTime;
  const { days, hours, minutes } = getDaysHoursMinutesRemaining(eventTime);

  // Remove all colour references from Footnote HTML string
  const parsedFootnoteDark: string =
    theme.colorScheme === 'dark'
      ? event.Footnote.replaceAll('black', '#cecfd0').replaceAll(
          'rgb(0, 22, 98)',
          '#7787e4'
        )
      : event.Footnote;

  const crumbs = [
    { title: state.toUpperCase(), href: `/${state}/events` },
    { title: 'Events', href: `/${state}/events` },
    { title: event.Title, href: router.asPath },
  ];

  return (
    <AppShell grads={grads} navItems={navItems}>
      <Box style={{ margin: '0 0 6px 10px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <Card shadow='sm' p='lg'>
        <Grid>
          <Grid.Col sm={5}>
            <Image
              mt={10}
              mb={10}
              src={event.Image?.data?.attributes?.url}
              alt=''
            />
            <Text
              weight={500}
              style={{
                fontFamily: 'Greycliff CF, sans-serif',
                fontSize: 'calc(1vw + 1vh + 2vmin)',
              }}
            >
              {event.Title}
            </Text>
            <Text weight={500} p={4}>
              {event.Description}
            </Text>
          </Grid.Col>
          <Grid.Col sm={6.8} ml='auto'>
            <Box
              sx={() => ({
                display: 'flex',
                flexFlow: 'column',
                height: 'calc(100vh - 180px)',
                [RESPONSIVE_WIDTH_TABLET]: {
                  height: '100%',
                },
              })}
            >
              <div style={{ flex: '0 1 auto' }}>
                {isEventOver
                  ? galleryAvailable && (
                      <Link
                        href={
                          '/' +
                          router.query.state +
                          '/gallery/' +
                          router.query.slug?.toString()
                        }
                      >
                        <a>
                          <Button
                            fullWidth
                            radius='xs'
                            variant='gradient'
                            size='lg'
                            mt={12}
                            mb={16}
                            gradient={{
                              from:
                                theme.colorScheme === 'dark'
                                  ? '#d699e9'
                                  : '#9f58ad',
                              to:
                                theme.colorScheme === 'dark'
                                  ? '#d887fa'
                                  : '#ef61c2',
                            }}
                          >
                            Go to Photo Gallery
                          </Button>
                        </a>
                      </Link>
                    )
                  : event.RSVPURL && (
                      <Button
                        component='a'
                        href={event.RSVPURL}
                        target='_blank'
                        fullWidth
                        radius='xs'
                        variant='gradient'
                        size='lg'
                        mt={12}
                        mb={16}
                        gradient={{
                          from:
                            theme.colorScheme === 'dark'
                              ? '#d08dff'
                              : '#9546c1',
                          to:
                            theme.colorScheme === 'dark'
                              ? '#8687ff'
                              : '#5b6cf4',
                        }}
                      >
                        RSVP
                      </Button>
                    )}
                {!isNaN(days) && (
                  <>
                    <Text component='span'>
                      {isEventOver ? 'Event finished ' : 'Event starts in: '}
                    </Text>
                    <Text component='span' size='lg' weight={700}>
                      {isEventOver
                        ? `${days} Days ago`
                        : `${days} Days, ${hours} Hours, ${minutes} Minutes`}
                    </Text>
                  </>
                )}

                <Group my={20}>
                  <Grid style={{ width: '100%' }}>
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
                            background: '#43b2e9',
                            borderRadius: '5px',
                            padding: 5,
                            border: '2px solid black',
                          }}
                        >
                          {event.LocationURL ? (
                            <Map2 size={36} strokeWidth={2} color={'#fff'} />
                          ) : (
                            <Location
                              size={36}
                              strokeWidth={2}
                              color={'#fff'}
                            />
                          )}
                        </div>
                      </AspectRatio>
                      <Text
                        mt={10}
                        weight={600}
                        align='center'
                        sx={(theme) => ({
                          fontSize: theme.fontSizes.md,
                          [RESPONSIVE_WIDTH]: {
                            fontSize: theme.fontSizes.sm,
                          },
                        })}
                        variant={event.LocationURL ? 'link' : 'text'}
                        component={event.LocationURL ? 'a' : 'span'}
                        href={event.LocationURL ?? ''}
                        target='_blank'
                      >
                        {event.Location}
                      </Text>
                      <Text
                        sx={(theme) => ({
                          fontSize: theme.fontSizes.sm,
                          [RESPONSIVE_WIDTH]: {
                            fontSize: theme.fontSizes.xs,
                          },
                        })}
                        align='center'
                      >
                        {event.Suburb}
                      </Text>
                    </Grid.Col>
                    {eventTime.toString() === 'Invalid' && (
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
                            <Calendar
                              size={36}
                              strokeWidth={2}
                              color={'#fff'}
                            />
                          </div>
                        </AspectRatio>
                        <Text
                          mt={10}
                          weight={600}
                          align='center'
                          sx={(theme) => ({
                            fontSize: theme.fontSizes.md,
                            [RESPONSIVE_WIDTH]: {
                              fontSize: theme.fontSizes.sm,
                            },
                          })}
                        >
                          {eventTime.toDateString().slice(0, -5)}
                        </Text>
                        <Text
                          sx={(theme) => ({
                            fontSize: theme.fontSizes.sm,
                            [RESPONSIVE_WIDTH]: {
                              fontSize: theme.fontSizes.xs,
                            },
                          })}
                        >
                          Date
                        </Text>
                      </Grid.Col>
                    )}
                    {event.Time && (
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
                            [RESPONSIVE_WIDTH]: {
                              fontSize: theme.fontSizes.sm,
                            },
                          })}
                        >
                          {event.Time}
                        </Text>
                        <Text
                          sx={(theme) => ({
                            fontSize: theme.fontSizes.sm,
                            [RESPONSIVE_WIDTH]: {
                              fontSize: theme.fontSizes.xs,
                            },
                          })}
                        >
                          Time
                        </Text>
                      </Grid.Col>
                    )}
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
                          <CurrencyDollar
                            size={36}
                            strokeWidth={2}
                            color={'#fff'}
                          />
                        </div>
                      </AspectRatio>
                      <Text
                        sx={(theme) => ({
                          fontSize: theme.fontSizes.md,
                          [RESPONSIVE_WIDTH]: {
                            fontSize: theme.fontSizes.sm,
                          },
                        })}
                        mt={10}
                        weight={600}
                        align='center'
                      >
                        {event.Cost === '$' || !event.Cost
                          ? 'BYO / None'
                          : event.Cost}
                      </Text>
                      <Text
                        sx={(theme) => ({
                          fontSize: theme.fontSizes.sm,
                          [RESPONSIVE_WIDTH]: {
                            fontSize: theme.fontSizes.xs,
                          },
                        })}
                      >
                        Price
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Group>
              </div>
              <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                <ScrollArea
                  style={{ flex: '0 1 auto' }}
                  type='auto'
                  offsetScrollbars
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(parsedFootnoteDark),
                    }}
                  />
                </ScrollArea>
              </MediaQuery>
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(parsedFootnoteDark),
                  }}
                />
              </MediaQuery>
            </Box>
          </Grid.Col>
        </Grid>
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    data: {
      events: { data },
    },
  } = await client.query({
    query: QUERY_SPECIFIC_EVENT,
    variables: { slug: context?.params?.slug },
  });

  let galleryAvailable = false;
  if (new Date(data[0].attributes.Date) < new Date()) {
    const {
      data: { galleries },
    } = await client.query({
      query: QUERY_SPECIFIC_GALLERY,
      variables: { slug: context?.params?.slug },
    });
    if (galleries.data.length > 0) {
      galleryAvailable = true;
    }
  }

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  return {
    props: { event: data[0].attributes, grads: grads.data, galleryAvailable },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: {
      events: { data },
    },
  } = await client.query({
    query: QUERY_EVENT_SLUGS,
  });

  const paths = data.map((event: Event) => {
    return {
      params: {
        slug: event.attributes.Slug,
        state: event.attributes.State.toLowerCase(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export default Events;
