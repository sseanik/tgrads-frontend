import 'react-tiny-fab/dist/styles.css';

import { Box, Card } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action, Fab } from 'react-tiny-fab';
import { Filter, Plus, Upload } from 'tabler-icons-react';

import UploadPhotoModal from '../../components/Modal/UploadPhotoModal';
import AppShell from '../../components/Navigation/AppShell';
import Breadcrumbs from '../../components/Navigation/Breadcrumbs';
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
  const [photosAndTags, setPhotosAndTags] =
    useState<FaceBoxAttributes[]>(galleryPhotoTags);
  const router = useRouter();
  const [opened, setOpened] = useState<boolean>(false);
  const [fabComponent, setFabComponent] = useState(<></>);

  const crumbs = [
    { title: 'Photo Gallery', href: '/gallery' },
    {
      title: gallery.Event.data.attributes.Title,
      href: router.asPath,
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFabComponent(
        <Fab
          icon={<Plus />}
          event='hover'
          alwaysShowTitle={true}
          mainButtonStyles={{ backgroundColor: '#666AF3' }}
        >
          <Action
            text='Upload Photo'
            style={{ backgroundColor: '#9a53e6' }}
            onClick={() => setOpened(true)}
          >
            <Upload />
          </Action>
          <Action text='Filter Photos' style={{ backgroundColor: '#9a53e6' }}>
            <Filter />
          </Action>
        </Fab>
      );
    }
  }, []);

  return (
    <AppShell names={names}>
      <Box style={{ margin: '0 0 6px 2px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <UploadPhotoModal opened={opened} setOpened={setOpened} slug={slug} />
      {fabComponent}
      <Card shadow='sm' p='sm'>
        <PhotoGallery
          photos={gallery.Photos.data}
          photosAndTags={photosAndTags}
          setPhotosAndTags={setPhotosAndTags}
          names={names}
          slug={slug}
        />
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log('Running getStaticProps...');
  const {
    data: {
      galleries: { data },
    },
  } = await client.query({
    query: QUERY_SPECIFIC_GALLERY,
    variables: { slug: context?.params?.slug },
  });

  const {
    data: { photoTags },
  } = await client.query({
    query: QUERY_PHOTO_TAGS,
    variables: { slug: context?.params?.slug },
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const names = mapAndSortNames(grads);

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
