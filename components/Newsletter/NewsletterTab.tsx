import { Accordion, Card, Text } from '@mantine/core';

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
            <Text>{newsletter.attributes.Description}</Text>
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
