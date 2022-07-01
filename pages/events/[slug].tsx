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
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Calendar,
  Clock,
  CurrencyDollar,
  Location,
  Map2,
} from 'tabler-icons-react';

import AppShell from '../../components/AppShell';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  QUERY_EVENT_SLUGS,
  QUERY_SPECIFIC_EVENT,
} from '../../graphql/queries/events';
import client from '../../lib/apollo';
import { Event, EventAttributes } from '../../types/Event';
import getDaysHoursMinutesRemaining from '../../utils/getDaysHoursMinutesRemaining';

const Events: NextPage<{ event: EventAttributes }> = ({ event }) => {
  const theme = useMantineTheme();
  const router = useRouter();

  const eventTime: Date = new Date(event.Date + ' ' + event.Time);
  const isEventOver: boolean = new Date() > eventTime;
  const { days, hours, minutes } = getDaysHoursMinutesRemaining(eventTime);

  const parsedFootnoteDark: string =
    theme.colorScheme === 'dark'
      ? event.Footnote.replaceAll('black', '#cecfd0').replaceAll(
          'rgb(0, 22, 98)',
          '#7787e4'
        )
      : event.Footnote;

  const crumbs = [
    { title: 'Events', href: '/events' },
    { title: event.Title, href: router.query.slug?.toString() ?? '' },
  ];

  return (
    <AppShell>
      <Box style={{ margin: '0 0 6px 2px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <Card shadow='sm' p='lg'>
        <Grid>
          <Grid.Col sm={5}>
            <Image
              mt={10}
              mb={10}
              src={event.Image?.data.attributes.url}
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

                '@media (max-width: 768px)': {
                  height: '100%',
                },
              })}
            >
              <div style={{ flex: '0 1 auto' }}>
                {isEventOver ? (
                  <Button
                    fullWidth
                    radius='xs'
                    variant='gradient'
                    size='lg'
                    mt={12}
                    mb={16}
                    gradient={{
                      from:
                        theme.colorScheme === 'dark' ? '#d699e9' : '#9f58ad',
                      to: theme.colorScheme === 'dark' ? '#d887fa' : '#ef61c2',
                    }}
                  >
                    Go to Photo Gallery
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    radius='xs'
                    variant='gradient'
                    size='lg'
                    mt={12}
                    mb={16}
                    gradient={{
                      from:
                        theme.colorScheme === 'dark' ? '#d08dff' : '#9546c1',
                      to: theme.colorScheme === 'dark' ? '#8687ff' : '#5b6cf4',
                    }}
                  >
                    RSVP
                  </Button>
                )}
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
                          {event.GoogleMapsURL ? (
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
                          '@media (max-width: 550px)': {
                            fontSize: theme.fontSizes.sm,
                          },
                        })}
                        mt={10}
                        weight={600}
                        align='center'
                      >
                        {event.Cost === "$" ? 'BYO' : event.Cost}
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
              </div>
              <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                <ScrollArea
                  style={{ flex: '0 1 auto' }}
                  type='auto'
                  offsetScrollbars
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: parsedFootnoteDark }}
                  />
                </ScrollArea>
              </MediaQuery>
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <div dangerouslySetInnerHTML={{ __html: parsedFootnoteDark }} />
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
    query: QUERY_SPECIFIC_EVENT(context?.params?.slug),
  });

  return {
    props: { event: data[0].attributes },
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
    return { params: { slug: event.attributes.Slug } };
  });

  return {
    paths,
    fallback: false,
  };
};

export default Events;
