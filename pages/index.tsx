import { Box, Button, Tabs } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import AppShell from '../components/Navigation/AppShell';
import NewsletterTab from '../components/Newsletter/NewsletterTab';
import { QUERY_ALL_NEWSLETTERS } from '../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { homeNavItems } from '../lib/navItem';
import { Newsletter } from '../types/Newsletter';
import { Grad } from '../types/User';

const Home: NextPage<{
  grads: Grad[];
  newsletters: Newsletter[];
}> = ({ grads, newsletters }) => {
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const publishedNewsletters = newsletters.filter(
    (newsletter) => newsletter.attributes.publishedAt !== null
  );

  return (
    <AppShell grads={grads} navItems={homeNavItems}>
      <Tabs defaultValue='tab-0'>
        <Tabs.List>
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
          {loggedIn !== '' && JSON.parse(loggedIn).TGA && (
            <Tabs.Tab value={'tab-admin'}>ADMIN</Tabs.Tab>
          )}
        </Tabs.List>
        
        {publishedNewsletters.map((newsletter, index) => {
          return (
            <Tabs.Panel key={newsletter.attributes.Slug} value={`tab-${index}`}>
              <NewsletterTab newsletter={newsletter} grads={grads} />
            </Tabs.Panel>
          );
        })}

        {loggedIn !== '' && JSON.parse(loggedIn).TGA && (
          <Tabs.Panel value='tab-admin'>
            <Box mt={10} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {newsletters.map((newsletter) => {
                return (
                  <Link
                    href={`/newsletter/${newsletter.attributes.Slug}`}
                    key={newsletter.attributes.Slug}
                  >
                    <a>
                      <Button size='xs'>{newsletter.attributes.Slug}</Button>
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
    query: QUERY_ALL_NEWSLETTERS,
  });

  const newsletters = data.sort((a: Newsletter, b: Newsletter) => {
    return (
      new Date(b.attributes.FirstDayOfMonth).valueOf() -
      new Date(a.attributes.FirstDayOfMonth).valueOf()
    );
  });

  return {
    props: { newsletters, grads: grads.data },
  };
};

export default Home;
