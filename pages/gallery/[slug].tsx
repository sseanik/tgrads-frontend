import { Box, Card } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import AppShell from '../../components/AppShell';
import Breadcrumbs from '../../components/Breadcrumbs';
import PhotoGallery from '../../components/PhotoGallery';
import {
  QUERY_GALLERY_SLUGS,
  QUERY_SPECIFIC_GALLERY,
} from '../../graphql/queries/galleries';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import { QUERY_PHOTO_TAGS } from '../../graphql/queries/photoTags';
import client from '../../lib/apollo';
import { FaceBoxAttributes } from '../../types/FaceBoxes';
import { Gallery, GalleryAttributes } from '../../types/Gallery';
import { mapAndSortNames } from '../../utils/mapAndSortNames';

const Events: NextPage<{
  gallery: GalleryAttributes;
  galleryPhotoTags: FaceBoxAttributes[];
  names: string[];
  slug: string;
}> = ({ gallery, galleryPhotoTags, names, slug }) => {
  const router = useRouter();

  const crumbs = [
    { title: 'Photo Gallery', href: '/gallery' },
    {
      title: gallery.Event.data.attributes.Title,
      href: router.asPath,
    },
  ];

  return (
    <AppShell names={names}>
      <Box style={{ margin: '0 0 6px 2px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <Card shadow='sm' p='sm'>
        <PhotoGallery
          photos={gallery.Photos.data}
          galleryPhotoTags={galleryPhotoTags}
          names={names}
          slug={slug}
        />
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log("Running getStaticProps...")
  const {
    data: {
      galleries: { data },
    },
  } = await client.query({
    query: QUERY_SPECIFIC_GALLERY(context?.params?.slug),
  });

  const {
    data: { photoTags },
  } = await client.query({
    query: QUERY_PHOTO_TAGS(context?.params?.slug),
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads)

  return {
    props: {
      gallery: data[0].attributes,
      galleryPhotoTags: photoTags.data,
      names: names,
      slug: context?.params?.slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: {
      galleries: { data },
    },
  } = await client.query({
    query: QUERY_GALLERY_SLUGS,
  });

  const paths = data.map((gallery: Gallery) => {
    return { params: { slug: gallery.attributes.Event.data?.attributes.Slug } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default Events;
