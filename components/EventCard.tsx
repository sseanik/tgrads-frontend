import {
  Card,
  Center,
  Grid,
  Group,
  Image as MantineImage,
  Indicator,
  MantineProvider,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Crossfade from 'react-crossfade-responsive';

import { Event } from '../types/Event';
import { GalleryPhotoReduced } from '../types/Gallery';
import {
  convertDateToReadable,
  isDateSoon,
  isUpcomingDate,
} from '../utils/dateAndTimeUtil';

interface EventCardProps {
  event: Event;
  photos?: GalleryPhotoReduced[];
  recap?: string;
}

const RESPONSIVE_WIDTH = '@media (max-width: 730px)';

const EventCard = ({ event, photos, recap }: EventCardProps) => {
  // Router to get state from the URL
  const router = useRouter();
  const state = router.query.state as string;
  // Theme for detecting current color mode and spacing
  const theme = useMantineTheme();

  return (
    <Link
      href={`/${state}/${photos ? 'gallery' : 'events'}/${
        event?.attributes?.Slug
      }`}
    >
      <a>
        <UnstyledButton
          sx={{
            width: '340px',
            [RESPONSIVE_WIDTH]: {
              width: '100%',
            },
          }}
        >
          <Indicator
            inline
            size={
              isUpcomingDate(event?.attributes.Date) &&
              isDateSoon(event.attributes.Date)
                ? 20
                : 0
            }
            offset={12}
            label={
              isUpcomingDate(event?.attributes.Date) &&
              isDateSoon(event.attributes.Date)
                ? 'Soon'
                : ''
            }
            color='lime'
          >
            <Indicator
              inline
              size={20}
              offset={30}
              label={
                event?.attributes.Cost === '$' ? '' : event?.attributes.Cost
              }
              color={theme.colorScheme === 'dark' ? 'black' : 'white'}
              position='top-start'
              radius='sm'
              styles={{
                indicator: {
                  marginLeft: '12px',
                  color: theme.colorScheme === 'dark' ? 'white' : 'black',
                  padding: 10,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  boxShadow:
                    '0 2px 2px rgba(0,0,0,0.16), 0 2px 2px rgba(0,0,0,0.23)',
                  display:
                    event?.attributes.Cost === '$' || !event?.attributes.Cost
                      ? 'none'
                      : '',
                },
              }}
            >
              <MantineProvider
                inherit
                theme={{
                  components: {
                    Card: {
                      styles: (theme) => ({
                        root: {
                          '&:hover': {
                            backgroundColor:
                              theme.colorScheme === 'dark'
                                ? '#242936'
                                : '#f6f8ff',
                          },
                        },
                      }),
                    },
                  },
                }}
              >
                <Card shadow='sm' withBorder p='lg' m={10}>
                  <Card.Section>
                    {photos ? (
                      <Crossfade
                        images={photos?.map((photo) => photo.attributes.url)}
                        height='180px'
                        width='100%'
                      />
                    ) : (
                      event.attributes.Image?.data && (
                        <MantineImage
                          src={event.attributes.Image?.data.attributes.url}
                          height={160}
                          alt=''
                        />
                      )
                    )}
                  </Card.Section>

                  <Grid columns={7}>
                    <Grid.Col span={1}>
                      {event?.attributes.Date && (
                        <Center
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                          }}
                        >
                          <div
                            style={{
                              color: '#666af3',
                              fontWeight: 600,
                              marginBottom: '6px',
                            }}
                          >
                            {convertDateToReadable(
                              event?.attributes.Date,
                              true
                            )}
                          </div>
                          <div style={{ fontWeight: 700 }}>
                            {convertDateToReadable(event?.attributes.Date)}
                          </div>
                        </Center>
                      )}
                    </Grid.Col>
                    <Grid.Col span={event?.attributes.Date ? 6 : 7}>
                      <Group
                        position='apart'
                        style={{
                          marginBottom: event?.attributes.Date ? 5 : undefined,
                          marginTop: event?.attributes.Date
                            ? theme.spacing.sm
                            : undefined,
                        }}
                      >
                        <Text weight={700}>{event?.attributes.Title}</Text>
                      </Group>
                      <Text
                        lineClamp={4}
                        size='sm'
                        style={{
                          color:
                            theme.colorScheme === 'dark'
                              ? theme.colors.dark[1]
                              : theme.colors.gray[7],
                          lineHeight: 1.5,
                        }}
                      >
                        {recap ? recap : event?.attributes.Description}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              </MantineProvider>
            </Indicator>
          </Indicator>
        </UnstyledButton>
      </a>
    </Link>
  );
};

export default EventCard;
