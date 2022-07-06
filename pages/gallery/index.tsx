import { GetStaticProps, NextPage } from 'next';

import EventCard from '../../components/EventCard';
import AppShell from '../../components/Navigation/AppShell';
import { QUERY_ALL_GALLERIES } from '../../graphql/queries/galleries';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';
import { Gallery } from '../../types/Gallery';
import { mapAndSortNames } from '../../utils/mapAndSortNames';

const Gallery: NextPage<{ galleries: Gallery[]; names: string[] }> = ({
  galleries,
  names,
}) => {
  return (
    <AppShell names={names}>
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
              event={gallery.attributes.Event.data}
              key={gallery.attributes.Event.data?.attributes.Slug}
              photos={gallery.attributes.FeaturedPhotos.data}
            />
          );
        })}
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: {
      galleries: { data },
    },
  } = await client.query({
    query: QUERY_ALL_GALLERIES,
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

export default Gallery;
