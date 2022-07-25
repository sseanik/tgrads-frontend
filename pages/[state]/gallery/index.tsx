import { Box } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import EventCard from '../../../components/EventCard';
import AppShell from '../../../components/Navigation/AppShell';
import Breadcrumbs from '../../../components/Navigation/Breadcrumbs';
import { QUERY_STATE_GALLERIES } from '../../../graphql/queries/galleries';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import client from '../../../lib/apollo';
import { navItems } from '../../../lib/navItem';
import { Gallery } from '../../../types/Gallery';
import { mapAndSortNames } from '../../../utils/mapAndSortNames';

const Gallery: NextPage<{ galleries: Gallery[]; names: string[] }> = ({
  galleries,
  names,
}) => {
  const router = useRouter();

  if (galleries.length === 0)
    return (
      <AppShell names={names} navItems={navItems}>
        <></>
      </AppShell>
    );

  const state = router.query.state as string;

  const crumbs = [
    { title: state.toUpperCase(), href: `/${state}/gallery` },
    { title: 'Gallery', href: `/${state}/gallery` },
  ];

  return (
    <AppShell names={names} navItems={navItems}>
      <Box style={{ margin: '0 0 10px 10px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      {galleries
        .slice()
        .sort((a, b) =>
          new Date(a.attributes.Event.data.attributes.Date) <
          new Date(b.attributes.Event.data.attributes.Date)
            ? 1
            : -1
        )
        .map((gallery: Gallery) => {
          return (
            <EventCard
              recap={gallery.attributes.Recap}
              event={gallery.attributes.Event.data}
              key={gallery.attributes.Event.data?.attributes.Slug}
              photos={gallery.attributes.FeaturedPhotos.data}
            />
          );
        })}
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const state = context?.params?.state as string;
  const {
    data: {
      galleries: { data },
    },
  } = await client.query({
    query: QUERY_STATE_GALLERIES,
    variables: { state: state.toUpperCase() },
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads);

  return {
    props: { galleries: data, names: names },
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

export default Gallery;
