import { useLocalStorage } from '@mantine/hooks';

import { Newsletter } from '../../types/Newsletter';
import { Grad } from '../../types/User';
import { getMonthName } from '../../utils/dateAndTimeUtil';
import Birthdays from './BirthdayBlurb';
import CalendarTable from './CalendarBlurb';
import EventPost from './EventBlurb';
import HeaderBlurb from './HeaderBlurb';
import StatePost from './StateBlurb';

interface NewsletterProps {
  newsletter: Newsletter;
  grads: Grad[];
}

const NewsletterTab = ({ newsletter, grads }: NewsletterProps) => {
  // Use local storage to determine logged in user's state
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  // Reorder State Blurbs with logged in state to come first
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
      {/* Header Accordion */}
      <HeaderBlurb
        title={newsletter.attributes.Title}
        gif={newsletter.attributes.Gif}
        description={newsletter.attributes.Description}
      />
      {/* State Blurb Accordions minimised */}
      {sortedStateBlurbs.map((blurb) => {
        return <StatePost key={blurb.State} blurb={blurb} />;
      })}
      {/* Event Blurb Accordions */}
      {newsletter.attributes.EventBlurbs.map((blurb) => {
        return <EventPost key={blurb.Title} blurb={blurb} />;
      })}
      {/* Birthday Blurb Accordion */}
      <Birthdays
        month={getMonthName(newsletter.attributes.FirstDayOfMonth)}
        grads={grads}
      />
      {/* Calendar Table Blurb Accordion */}
      <CalendarTable table={newsletter.attributes.CalendarTable} />
    </>
  );
};

export default NewsletterTab;
