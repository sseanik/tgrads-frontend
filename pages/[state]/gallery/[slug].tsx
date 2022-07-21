import 'react-tiny-fab/dist/styles.css';

import { Box, Card } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action, Fab } from 'react-tiny-fab';
import { Filter, FilterOff, Plus, Upload } from 'tabler-icons-react';

import UploadPhotoModal from '../../../components/Modal/UploadPhotoModal';
import AppShell from '../../../components/Navigation/AppShell';
import Breadcrumbs from '../../../components/Navigation/Breadcrumbs';
import PhotoGallery from '../../../components/PhotoGallery';
import {
  QUERY_GALLERY_SLUGS,
  QUERY_SPECIFIC_GALLERY,
} from '../../../graphql/queries/galleries';
import { QUERY_ALL_NAMES } from '../../../graphql/queries/people';
import { QUERY_PHOTO_TAGS } from '../../../graphql/queries/photoTags';
import client from '../../../lib/apollo';
import { FaceBoxAttributes } from '../../../types/FaceBoxes';
import { Gallery, GalleryAttributes, GalleryPhoto } from '../../../types/Gallery';
import { mapAndSortNames } from '../../../utils/mapAndSortNames';

const Events: NextPage<{
  gallery: GalleryAttributes;
  galleryPhotoTags: FaceBoxAttributes[];
  names: string[];
  slug: string;
  galleryID: string;
}> = ({ gallery, galleryPhotoTags, names, slug, galleryID }) => {
  const [photosAndTags, setPhotosAndTags] =
    useState<FaceBoxAttributes[]>(galleryPhotoTags);
  const router = useRouter();
  const [opened, setOpened] = useState<boolean>(false);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(gallery.Photos.data);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [fabComponent, setFabComponent] = useState(<></>);
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const crumbs = [
    { title: 'Photo Gallery', href: '/gallery' },
    {
      title: gallery.Event.data.attributes.Title,
      href: router.asPath,
    },
  ];

  useEffect(() => {
    const photoIDsWithName = (name: string) => {
      return photosAndTags
        .filter((photoAndTag) => {
          if (typeof photoAndTag.attributes.FaceBoxes !== 'string') {
            return photoAndTag.attributes.FaceBoxes.find(
              (faceBox) => faceBox.name === name
            )
              ? true
              : false;
          } else {
            return JSON.parse(photoAndTag.attributes.FaceBoxes).find(
              (faceBox) => faceBox.name === name
            )
              ? true
              : false;
          }
        })
        .map((photoAndTag) => photoAndTag.attributes.PhotoID);
    };

    const handleFilterPhotos = () => {
      if (filtered) {
        setPhotos(gallery.Photos.data);
        setFiltered(false);
      } else if (loggedIn !== '') {
        const photosWithName = photoIDsWithName(loggedIn);
        setPhotos(photos.filter((photo) => photosWithName.includes(photo.id)));
        setFiltered(true);
      }
    };

    if (loggedIn === '') {
      setPhotos(gallery.Photos.data);
      setFiltered(false);
    }

    if (typeof window !== 'undefined') {
      setFabComponent(
        <Fab
          icon={<Plus />}
          event='hover'
          alwaysShowTitle={true}
          mainButtonStyles={{
            backgroundImage:
              'linear-gradient(45deg,  #9546c1 20%, #5a46c1 40%, #5b6cf4 60%)',
          }}
        >
          <Action
            text='Upload Photo'
            style={{
              backgroundImage:
                'linear-gradient(45deg,  #9873ff 20%, #986aff 40%, #c879ff 60% )',
            }}
            onClick={() => setOpened(true)}
          >
            <Upload />
          </Action>
          {loggedIn !== '' &&
            (filtered ? (
              <Action
                text='Disable Filter'
                style={{
                  backgroundImage:
                    'linear-gradient(45deg,  #8873ea 20%, #9177ff 40%, #b183f7 60% )',
                }}
                onClick={handleFilterPhotos}
              >
                <FilterOff />
              </Action>
            ) : (
              <Action
                text='Filter Photos'
                style={{
                  backgroundImage:
                    'linear-gradient(45deg,  #8873ea 20%, #9177ff 40%, #b183f7 60% )',
                }}
                onClick={handleFilterPhotos}
              >
                <Filter />
              </Action>
            ))}
        </Fab>
      );
    }
  }, [filtered, gallery.Photos.data, loggedIn, photos, photosAndTags]);

  return (
    <AppShell names={names}>
      <Box style={{ margin: '0 0 6px 2px' }}>
        <Breadcrumbs crumbs={crumbs} />
      </Box>
      <UploadPhotoModal
        opened={opened}
        setOpened={setOpened}
        slug={slug}
        galleryID={galleryID}
      />
      {fabComponent}
      <Card shadow='sm' p='sm'>
        <PhotoGallery
          photos={photos}
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
      galleryID: data[0].id,
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
