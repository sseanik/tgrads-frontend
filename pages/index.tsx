import type { GetStaticProps, NextPage } from 'next';

import AppShell from '../components/Navigation/AppShell';
import Scheduler from '../components/Scheduler';
import { QUERY_ALL_NAMES } from '../graphql/queries/people';
import client from '../lib/apollo';
import { mapAndSortNames } from '../utils/mapAndSortNames';

const Home: NextPage<{
  names: string[];
}> = ({ names }) => {

  return (
    <AppShell names={names}>
      <Scheduler />
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
