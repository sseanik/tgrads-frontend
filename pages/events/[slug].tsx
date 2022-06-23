import {
  Card,
  Text,
  Image,
  Grid,
  Button,
  useMantineTheme,
  Group,
  AspectRatio,
  ScrollArea,
  MediaQuery,
} from '@mantine/core';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import AppShell from '../../components/AppShell';
import { fetchAPI } from '../../lib/api';
import { Calendar, Clock, CurrencyDollar, Location } from 'tabler-icons-react';
export interface attributes {
  Title: string;
  Description: string;
  Date: string;
  Time: string;
  Location: string;
  Suburb: string;
  GoogleMapsURL: string;
  Footnote: string;
  Image: eventImage;
  Cost: number;
}

type eventImage = {
  data: {
    attributes: {
      alternativeText: string;
      caption: string;
      height: number;
      width: number;
      url: string;
    };
  };
};

const Events: NextPage<{ event: attributes }> = ({ event }) => {
  const theme = useMantineTheme();

  const eventTime = new Date(event.Date + ' ' + event.Time);
  const timeNow = new Date().getTime();
  let delta = Math.abs(eventTime.getTime() - timeNow) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;

  return (
    <AppShell>
      <Card shadow='sm' p='lg'>
        <Grid>
          <Grid.Col sm={5}>
            <Image
              mt={10}
              mb={10}
              src={event.Image.data.attributes.url}
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
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                height: 'calc(100vh - 150px)',
              }}
            >
              <div style={{ flex: '0 1 auto' }}>
                <Button
                  fullWidth
                  radius='xs'
                  variant='gradient'
                  size='lg'
                  mt={12}
                  mb={16}
                  gradient={{
                    from: theme.colorScheme === 'dark' ? '#d08dff' : '#9546c1',
                    to: theme.colorScheme === 'dark' ? '#8687ff' : '#5b6cf4',
                  }}
                >
                  RSVP
                </Button>
                <Text component='span'>Event starts in: </Text>
                <Text
                  component='span'
                  size='lg'
                  weight={700}
                >{`${days} Days, ${hours} Hours, ${minutes} Minutes`}</Text>

                <Group m={20}>
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
                          <Location size={36} strokeWidth={2} color={'#fff'} />
                        </div>
                      </AspectRatio>
                      <Text mt={10} weight={600} align='center'>
                        {event.Location}
                      </Text>
                      <Text size='sm'>{event.Suburb}</Text>
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
                      <Text mt={10} weight={600} align='center'>
                        {eventTime.toDateString().slice(0, -5)}
                      </Text>
                      <Text size='sm'>Date</Text>
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
                      <Text mt={10} weight={600} align='center'>
                        {event.Time}
                      </Text>
                      <Text size='sm'>Time</Text>
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
                      <Text mt={10} weight={600} align='center'>
                        {event.Cost}
                      </Text>
                      <Text size='sm'>Price</Text>
                    </Grid.Col>
                  </Grid>
                </Group>
              </div>
              <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                <ScrollArea style={{ flex: '0 1 auto' }} type='auto'>
                  <div dangerouslySetInnerHTML={{ __html: event.Footnote }} />
                </ScrollArea>
              </MediaQuery>
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <div dangerouslySetInnerHTML={{ __html: event.Footnote }} />
              </MediaQuery>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const eventResponse = await fetchAPI('events', {
    filters: {
      slug: params.slug,
    },
    populate: ['Image'],
  });

  return {
    props: { event: eventResponse.data[0].attributes },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await fetchAPI('events', { fields: ['slug'] });

  const paths = data.map((event: { id: number; attributes: any }) => {
    return { params: { slug: event.attributes.Slug } };
  });

  return {
    paths,
    fallback: false,
  };
};

export default Events;
