import { Accordion, Box, Card, Group, Text, ThemeIcon } from '@mantine/core';
import React from 'react';
import Crossfade from 'react-crossfade-responsive';
import {
  GiGoat,
  GiHorseHead,
  GiLightningStorm,
  GiPirateFlag,
  GiSydneyOperaHouse,
  GiVikingHead,
} from 'react-icons/gi';

import { StateBlurb } from '../../types/Newsletter';

interface AccordionLabelProps {
  label: string;
}

const AccordionLabel = ({ label }: AccordionLabelProps) => {
  const states = {
    NSW: {
      name: 'New South Wales',
      icon: <GiSydneyOperaHouse size={22} />,
      colour: 'blue',
    },
    QLD: { name: 'Queensland', icon: <GiHorseHead size={22} />, colour: 'red' },
    SA: {
      name: 'South Australia',
      icon: <GiGoat size={22} />,
      colour: 'yellow',
    },
    VIC: {
      name: 'Victoria',
      icon: <GiLightningStorm size={22} />,
      colour: 'indigo',
    },
    WA: {
      name: 'Western Australia',
      icon: <GiPirateFlag size={22} />,
      colour: 'orange',
    },
    ACT: {
      name: 'Australian Capital Territory',
      icon: <GiVikingHead size={22} />,
      colour: 'green',
    },
  };

  return (
    <Group noWrap>
      <ThemeIcon color={states[label].colour} variant='light'>
        {states[label].icon}
      </ThemeIcon>
      <div>
        <Text>{label}</Text>
        <Text size='sm' color='dimmed' weight={400}>
          {states[label].name}
        </Text>
      </div>
    </Group>
  );
};

interface StatePostProps {
  blurb: StateBlurb;
}

const StatePost = ({ blurb }: StatePostProps) => {
  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        iconPosition='right'
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item label={<AccordionLabel label={blurb.State} />} m={0}>
          <Box
            sx={() => ({
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              '@media (max-width: 900px)': {
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
                '@media (max-width: 900px)': {
                  width: '100%',
                },
                '#crossfade div:nth-of-type(2) img': {
                  color: 'red'
                }
              })}
            >
              <Crossfade
                images={blurb.Photos.data?.map((photo) => photo.attributes.url)}
                height='300px'
                width='min(400px, (100vw - 90px))'
              />
            </Box>
            <Box
              sx={() => ({
                paddingLeft: '20px',
                '@media (max-width: 900px)': {
                  paddingLeft: 0,
                  paddingTop: '20px',
                },
              })}
            >
              <Text>{blurb.Description}</Text>
            </Box>
          </Box>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default StatePost;
