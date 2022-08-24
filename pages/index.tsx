import { Box, Button, Tabs } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import { homeNavItems } from '../assets/navItem';
import AppShell from '../components/Navigation/AppShell';
import NewsletterTab from '../components/Newsletter/NewsletterTab';
import {
  QUERY_NEWSLETTER_SLUGS,
  QUERY_PUBLISHED_NEWSLETTERS,
} from '../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { Newsletter } from '../types/Newsletter';
import { Grad } from '../types/User';

const Home: NextPage<{
  grads: Grad[];
  newsletters: Newsletter[];
  newsletterSlugs: string[];
}> = ({ grads, newsletters, newsletterSlugs }) => {
  // Use loggedIn local storage item to determine admin (TGA) view
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  // Filter Published newsletter that have a 'publishedAt' date
  const publishedNewsletters = newsletters.filter(
    (newsletter) => newsletter.attributes.publishedAt !== null
  );

  return (
    <AppShell grads={grads} navItems={homeNavItems}>
      <Tabs defaultValue='tab-0'>
        <Tabs.List>
          {/* Month Tabs */}
          {publishedNewsletters.map((newsletter, index) => {
            return (
              <Tabs.Tab value={`tab-${index}`} key={newsletter.attributes.Slug}>
                {new Date(newsletter.attributes.FirstDayOfMonth).toLocaleString(
                  'default',
                  { month: 'long' }
                )}
              </Tabs.Tab>
            );
          })}
          {/* Admin Tab */}
          {loggedIn !== '' && JSON.parse(loggedIn).TGA && (
            <Tabs.Tab value={'tab-admin'}>ADMIN</Tabs.Tab>
          )}
        </Tabs.List>
        {/* Newsletter Panels */}
        {publishedNewsletters.map((newsletter, index) => {
          return (
            <Tabs.Panel key={newsletter.attributes.Slug} value={`tab-${index}`}>
              <NewsletterTab newsletter={newsletter} grads={grads} />
            </Tabs.Panel>
          );
        })}
        {/* Admin Newsletter Button Links */}
        {loggedIn !== '' && JSON.parse(loggedIn).TGA && (
          <Tabs.Panel value='tab-admin'>
            <Box mt={10} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {newsletterSlugs.map((slug) => {
                return (
                  <Link href={`/newsletter/${slug}`} key={slug}>
                    <a>
                      <Button size='xs'>{slug}</Button>
                    </a>
                  </Link>
                );
              })}
            </Box>
          </Tabs.Panel>
        )}
      </Tabs>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const {
    data: {
      newsletters: { data },
    },
  } = await client.query({
    query: QUERY_PUBLISHED_NEWSLETTERS,
  });

  const {
    data: { newsletters },
  } = await client.query({
    query: QUERY_NEWSLETTER_SLUGS,
  });

  const newsletterComparator = (a: Newsletter, b: Newsletter) => {
    return (
      new Date(b.attributes.FirstDayOfMonth).valueOf() -
      new Date(a.attributes.FirstDayOfMonth).valueOf()
    );
  };

  const newsletterSlugs = newsletters.data
    .sort(newsletterComparator)
    .map((newsletter) => newsletter.attributes.Slug);

  // Sort newsletters in decreasing Monthly order
  const sortedNewsletters = data.sort(newsletterComparator);

  return {
    props: {
      newsletters: sortedNewsletters,
      newsletterSlugs,
      grads: grads.data,
    },
  };
};

export default Home;
