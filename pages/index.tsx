import { Tabs } from '@mantine/core';
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';

import AppShell from '../components/Navigation/AppShell';
import NewsletterTab from '../components/Newsletter/NewsletterTab';
import { QUERY_ALL_NEWSLETTERS } from '../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { homeNavItems } from '../lib/navItem';
import { Newsletter } from '../types/Newsletter';
import { mapAndSortNames } from '../utils/mapAndSortNames';

const Home: NextPage<{
  names: string[];
  newsletters: Newsletter[];
}> = ({ names, newsletters }) => {

  const [activeTab, setActiveTab] = useState(0);
  return (
    <AppShell names={names} navItems={homeNavItems}>
      <Tabs color='indigo' active={activeTab} onTabChange={setActiveTab}>
        {newsletters.map((newsletter) => {
          return (
            <Tabs.Tab
              key={newsletter.attributes.Slug}
              label={new Date(
                newsletter.attributes.FirstDayOfMonth
              ).toLocaleString('default', { month: 'long' })}
            >
              <NewsletterTab newsletter={newsletter} />
            </Tabs.Tab>
          );
        })}
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

  const names = mapAndSortNames(grads);

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
    props: { names, newsletters },
  };
};

export default Home;
