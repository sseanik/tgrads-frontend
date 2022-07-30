import { Accordion, Box, Card, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import Image from 'next/image';

import { Newsletter } from '../../types/Newsletter';
import { Grad } from '../../types/User';
import Birthdays from './Birthdays';
import CalendarTable from './CalendarTable';
import EventPost from './EventPost';
import StatePost from './StatePost';

interface NewsletterProps {
  newsletter: Newsletter;
  grads: Grad[];
}

const NewsletterTab = ({ newsletter, grads }: NewsletterProps) => {
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const sortedStateBlurbs = loggedIn
    ? newsletter.attributes.StateBlurbs.filter(
        (blurb) => loggedIn !== '' && blurb.State !== JSON.parse(loggedIn).State
      )
    : newsletter.attributes.StateBlurbs;
  if (loggedIn) {
    const stateMatchedStateBlurb = newsletter.attributes.StateBlurbs.find(
      (blurb) => loggedIn !== '' && blurb.State === JSON.parse(loggedIn).State
    );
    if (stateMatchedStateBlurb)
      sortedStateBlurbs.unshift(stateMatchedStateBlurb);
  }

  return (
    <>
      <Card shadow='sm' p={0} mt={10} mb={8}>
        <Accordion
          defaultValue='newsletter-heading-0'
          styles={{
            label: { fontWeight: 700 },
          }}
        >
          <Accordion.Item value='newsletter-heading-0' m={0}>
            <Accordion.Control>{newsletter.attributes.Title}</Accordion.Control>
            <Accordion.Panel>
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
                      width: '100%',
                    },
                  })}
                >
                  {newsletter.attributes.Description}
                </Text>
              </Box>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
      {sortedStateBlurbs.map((blurb) => {
        return <StatePost key={blurb.State} blurb={blurb} />;
      })}
      {newsletter.attributes.EventBlurbs.map((blurb) => {
        return <EventPost key={blurb.Title} blurb={blurb} />;
      })}
      <Birthdays
        month={new Date(newsletter.attributes.FirstDayOfMonth).toLocaleString(
          'default',
          { month: 'long' }
        )}
        grads={grads}
      />
      <CalendarTable table={newsletter.attributes.CalendarTable} />
    </>
  );
};

export default NewsletterTab;
