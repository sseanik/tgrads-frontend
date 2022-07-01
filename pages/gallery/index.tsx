import { GetStaticProps, NextPage } from 'next';

import AppShell from '../../components/AppShell';
import EventCard from '../../components/EventCard';
import { QUERY_ALL_GALLERIES } from '../../graphql/queries/galleries';
import client from '../../lib/apollo';
import { Gallery } from '../../types/Gallery';

const Gallery: NextPage<{ galleries: Gallery[] }> = ({ galleries }) => {
  return (
    <AppShell>
      {galleries.map((gallery: Gallery) => {
        return (
          <EventCard
            event={gallery.attributes.Event.data}
            key={gallery.attributes.Event.data.attributes.Slug}
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

  return {
    props: { galleries: data },
  };
};

export default Gallery;
