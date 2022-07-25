import {
  Card,
  Center,
  createStyles,
  Grid,
  Group,
  Image as MantineImage,
  Indicator,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Crossfade from 'react-crossfade-responsive';

import { Event } from '../types/Event';
import { GalleryPhotoReduced } from '../types/Gallery';
import convertDateToReadable from '../utils/convertDateToReadable';
import isDateSoon from '../utils/isDateSoon';
import isUpcomingDate from '../utils/isUpcomingDate';

interface EventCardProps {
  event: Event;
  photos?: GalleryPhotoReduced[];
  recap?: string;
}

const EventCard = ({ event, photos, recap }: EventCardProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const useStyles = createStyles(() => ({
    cardW: {
      width: '340px',
      '@media (max-width: 730px)': {
        width: '100%',
      },
    },
    cardH: {
      height: 120,
      '@media (max-width: 730px)': {
        height: 85,
      },
    },
  }));
  const { classes } = useStyles();
  const eventType = photos ? 'gallery' : 'events';

  return (
    <Link
      href={`/${router.query.state}/${eventType}/${event?.attributes?.Slug}`}
    >
      <a>
        <UnstyledButton className={classes.cardW}>
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
              <Card
                shadow='sm'
                p='lg'
                m={10}
                style={{
                  height: '100%',
                }}
                styles={() => ({
                  root: {
                    color: theme.colorScheme === 'dark' ? '#d0cfd4' : '#3c4394',
                    height: '100%',
                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? '#242936' : '#f6f8ff',
                    },
                  },
                })}
              >
                <Card.Section>
                  {photos ? (
                    <Crossfade
                      images={photos?.map((photo) => photo.attributes.url)}
                      height='180px'
                      width='100%'
                    />
                  ) : (
                    <MantineImage
                      src={event.attributes.Image?.data.attributes.url}
                      height={160}
                      alt=''
                    />
                  )}
                </Card.Section>

                <Grid columns={7}>
                  <Grid.Col span={1}>
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
                        {convertDateToReadable(event?.attributes.Date, true)}
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {convertDateToReadable(event?.attributes.Date)}
                      </div>
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group
                      position='apart'
                      style={{
                        marginBottom: 5,
                        marginTop: theme.spacing.sm,
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
            </Indicator>
          </Indicator>
        </UnstyledButton>
      </a>
    </Link>
  );
};

export default EventCard;
