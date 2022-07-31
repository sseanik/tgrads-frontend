import { Accordion, Box, Card, useMantineTheme } from '@mantine/core';
import DOMPurify from 'isomorphic-dompurify';
import Crossfade from 'react-crossfade-responsive';

import { EventBlurb } from '../../types/Newsletter';

const RESPONSIVE_WIDTH = '@media (max-width: 900px)'

const EventPost = ({ blurb }: { blurb: EventBlurb }) => {
  const theme = useMantineTheme();

  // Replace all dark colours from HTML string
  const parsedDescription: string =
    theme.colorScheme === 'dark'
      ? blurb.Description.replaceAll('black', '#cecfd0')
          .replaceAll('rgb(0, 22, 98)', '#7787e4')
          .replaceAll('rgb(36, 36, 36)', '#c9c9c9')
          .replaceAll('rgb(34, 34, 34)', '#c9c9c9')
      : blurb.Description;

  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        defaultValue={`event-post-0-${blurb.Title}`}
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item value={`event-post-0-${blurb.Title}`} m={0}>
          <Accordion.Control>{blurb.Title}</Accordion.Control>
          <Accordion.Panel>
            <Box
              sx={() => ({
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                [RESPONSIVE_WIDTH]: {
                  flexDirection: 'column',
                },
              })}
            >
              {blurb.Photos.data.length > 0 && (
                <Box
                  sx={() => ({
                    width: '600px',
                    height: '300px',
                    [RESPONSIVE_WIDTH]: {
                      width: '100%',
                    },
                  })}
                >
                  <Crossfade
                    images={blurb.Photos.data?.map(
                      (photo) => photo.attributes.url
                    )}
                    height='100%'
                    width='min(600px, (100vw - 90px))'
                  />
                </Box>
              )}
              <Box
                sx={() => ({
                  flex: 1,
                  paddingLeft: blurb.Photos.data.length > 0 ? '20px' : 0,
                  [RESPONSIVE_WIDTH]: {
                    paddingLeft: 0,
                    paddingTop: '20px',
                  },
                })}
              >
                <div
                  style={{ marginBottom: -20, marginTop: -20 }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(parsedDescription),
                  }}
                />
              </Box>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default EventPost;
