import { GetStaticProps, NextPage } from 'next';

import AppShell from '../../components/AppShell';
import EventCard from '../../components/EventCard';
import { fetchAPI } from '../../lib/api';
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
  const galleryResponse = await fetchAPI('galleries', {
    populate: {
      Event: {
        fields: ['Date', 'Description', 'Location', 'Slug', 'Title'],
        populate: {
          Image: '*'
        }
      },
      FeaturedPhotos: {
        fields: ['url'],
      },
    },
  });

  return {
    props: { galleries: galleryResponse.data },
    revalidate: 1,
  };
};

export default Gallery;
