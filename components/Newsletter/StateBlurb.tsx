import { Accordion, Box, Card, Group, Text, ThemeIcon } from '@mantine/core';
import React from 'react';
import Crossfade from 'react-crossfade-responsive';

import { stateItems } from '../../assets/stateItem';
import { StateBlurb } from '../../types/Newsletter';

const StateAccordionLabel = ({ state }: { state: string }) => {
  return (
    <Group noWrap>
      <ThemeIcon color={stateItems[state].colour} variant='light'>
        {stateItems[state].icon}
      </ThemeIcon>
      <div>
        <Text>{state}</Text>
        <Text size='sm' color='dimmed' weight={400}>
          {stateItems[state].name}
        </Text>
      </div>
    </Group>
  );
};

const RESPONSIVE_WIDTH = '@media (max-width: 900px)';

const StatePost = ({ blurb }: { blurb: StateBlurb }) => {

  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item value={`state-post-${blurb.State}`} m={0}>
          <Accordion.Control>
            <StateAccordionLabel state={blurb.State} />
          </Accordion.Control>
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
              <Box
                id='crossfade'
                sx={() => ({
                  width: '400px',
                  height: '300px',
                  margin: '0 auto',
                  [RESPONSIVE_WIDTH]: {
                    width: '100%',
                  },
                  '#crossfade div:nth-of-type(2) img': {
                    color: 'red',
                  },
                })}
              >
                <Crossfade
                  images={blurb.Photos.data?.map(
                    (photo) => photo.attributes.url
                  )}
                  height='300px'
                  width='min(400px, (100vw - 90px))'
                />
              </Box>
              <Box
                sx={() => ({
                  paddingLeft: '20px',
                  [RESPONSIVE_WIDTH]: {
                    paddingLeft: 0,
                    paddingTop: '20px',
                  },
                })}
              >
                <Text>{blurb.Description}</Text>
              </Box>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default StatePost;
