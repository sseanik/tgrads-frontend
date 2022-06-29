import { Box, Card } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import AppShell from '../../components/AppShell';
import Breadcrumbs from '../../components/Breadcrumbs';
import PhotoGallery from '../../components/PhotoGallery';
import { fetchAPI } from '../../lib/api';
import { Gallery, GalleryAttributes } from '../../types/Gallery';

const Events: NextPage<{ gallery: GalleryAttributes }> = ({ gallery }) => {
  const router = useRouter();

  const crumbs = [
    { title: 'Home', href: '/' },
    { title: 'Photo Gallery', href: '/gallery' },
    {
      title: gallery.Event.data.attributes.Title,
      href: router.asPath,
    },
  ];

  return (
    <AppShell>
      <Box style={{ margin: '0 0 6px 2px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <Card shadow='sm' p='sm'>
        <PhotoGallery photos={gallery.Photos.data} />
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const galleryResponse = await fetchAPI('galleries', {
    filters: {
      Event: {
        Slug: context?.params?.slug,
      },
    },
    populate: ['Photos', 'Event'],
  });

  return {
    props: { gallery: galleryResponse.data[0].attributes },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await fetchAPI('galleries', {
    populate: {
      Event: {
        fields: ['Slug'],
      },
    },
  });

  const paths = data.map((gallery: Gallery) => {
    return { params: { slug: gallery.attributes.Event.data.attributes.Slug } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default Events;
