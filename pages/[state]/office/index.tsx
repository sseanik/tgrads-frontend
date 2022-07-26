import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import AppShell from '../../../components/Navigation/AppShell';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import client from '../../../lib/apollo';
import { navItems } from '../../../lib/navItem';
import { Grad } from '../../../types/User';

const Office: NextPage<{
  grads: Grad[];
}> = ({ grads }) => {
  return (
    <AppShell grads={grads} navItems={navItems}>
      <div>Hello</div>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  return {
    props: { grads: grads.data },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ['nsw', 'vic', 'qld', 'act', 'sa', 'wa', 'tas', 'nt'].map(
    (state: string) => {
      return { params: { state } };
    }
  );

  return {
    paths,
    fallback: false,
  };
};

export default Office;
