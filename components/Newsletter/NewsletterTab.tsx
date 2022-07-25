import { Accordion, Box, Card, Text } from '@mantine/core';
import Image from 'next/image';

import { Newsletter } from '../../types/Newsletter';
import EventPost from './EventPost';
import StatePost from './StatePost';

interface NewsletterProps {
  newsletter: Newsletter;
}

const NewsletterTab = ({ newsletter }: NewsletterProps) => {
  return (
    <>
      <Card shadow='sm' p={0} mb={8}>
        <Accordion
          initialItem={0}
          iconPosition='right'
          styles={{
            label: { fontWeight: 700 },
          }}
        >
          <Accordion.Item label={newsletter.attributes.Title} m={0}>
            <Box
              sx={() => ({
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                },
              })}
            >
              <Image
                src={newsletter.attributes.Gif}
                alt={`${newsletter.attributes.Title}-gif`}
                width={200}
                height={200}
                objectFit='contain'
              />
              <Text
                sx={() => ({
                  width: 'calc(100% - 200px)',
                  paddingLeft: '20px',
                  '@media (max-width: 600px)': {
                    paddingLeft: 0,
                    width: '100%'
                  },
                })}
              >
                {newsletter.attributes.Description}
              </Text>
            </Box>
          </Accordion.Item>
        </Accordion>
      </Card>
      {newsletter.attributes.StateBlurbs.map((blurb) => {
        return <StatePost key={blurb.State} blurb={blurb} />;
      })}
      {newsletter.attributes.EventBlurbs.map((blurb) => {
        return <EventPost key={blurb.Title} blurb={blurb} />;
      })}
    </>
  );
};

export default NewsletterTab;
