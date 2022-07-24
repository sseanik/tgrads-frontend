import type { GetStaticProps, NextPage } from 'next';

import AppShell from '../components/Navigation/AppShell';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { homeNavItems } from '../lib/navItem';
import { mapAndSortNames } from '../utils/mapAndSortNames';

const Home: NextPage<{
  names: string[];
}> = ({ names }) => {
  return (
    <AppShell names={names} navItems={homeNavItems}>
      <div></div>
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

  return {
    props: { names: names },
  };
};

export default Home;
