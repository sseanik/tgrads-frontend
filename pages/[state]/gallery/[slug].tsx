import 'react-tiny-fab/dist/styles.css';

import { Box, Card } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action, Fab } from 'react-tiny-fab';
import { Filter, FilterOff, Plus, Upload } from 'tabler-icons-react';

import { navItems } from '../../../assets/navItem';
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
import {
  Gallery,
  GalleryAttributes,
  GalleryPhoto,
} from '../../../types/Gallery';
import { Grad } from '../../../types/User';

interface EventsProps {
  gallery: GalleryAttributes;
  galleryPhotoTags: FaceBoxAttributes[];
  grads: Grad[];
  slug: string;
  galleryID: string;
}

const Events: NextPage<EventsProps> = ({
  gallery,
  galleryPhotoTags,
  grads,
  slug,
  galleryID,
}) => {
  console.log(gallery.Photos.data.length);
  // Router to get the state from the current URL
  const router = useRouter();
  const state = router.query.state as string;
  // Open/close state for upload photo modal
  const [opened, setOpened] = useState<boolean>(false);
  // State to store the gallery's photos
  const [photos, setPhotos] = useState<GalleryPhoto[]>(gallery.Photos.data);
  // State to store photos only containing the logged in user
  const [filtered, setFiltered] = useState<boolean>(false);
  // State to store photos and each photo's face tags
  const [photosAndTags, setPhotosAndTags] =
    useState<FaceBoxAttributes[]>(galleryPhotoTags);
  // Store fab component to behave with SSR
  const [fabComponent, setFabComponent] = useState(<></>);
  // Logged In local storage item to use for active photo filtering
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const crumbs = [
    { title: state.toUpperCase(), href: `/${state}/gallery` },
    { title: 'Gallery', href: `/${state}/gallery` },
    { title: gallery.Event.data.attributes.Title, href: router.asPath },
  ];

  useEffect(() => {
    // Find all photos and tags for the current gallery
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

    // When the filter icon is clicked, filter the photos based on the logged in user
    const handleFilterPhotos = () => {
      if (filtered) {
        setPhotos(gallery.Photos.data);
        setFiltered(false);
      } else if (loggedIn !== '') {
        // If user is not logged in
        const photosWithName = photoIDsWithName(JSON.parse(loggedIn).FullName);
        setPhotos(photos.filter((photo) => photosWithName.includes(photo.id)));
        setFiltered(true);
      }
    };

    // If the user is not logged in
    if (loggedIn === '') {
      setPhotos(gallery.Photos.data);
      setFiltered(false);
    }

    // Set the fab component to be used in SSR
    if (typeof window !== 'undefined') {
      setFabComponent(
        <Fab
          icon={<Plus />}
          event='hover'
          alwaysShowTitle={true}
          mainButtonStyles={{
            backgroundImage:
              'linear-gradient(45deg,  #9546c1 20%, #5a46c1 40%, #5b6cf4 60%)',
            border: '2px solid #000',
          }}
        >
          <Action
            text='Upload Photo'
            style={{
              backgroundImage:
                'linear-gradient(45deg,  #9873ff 20%, #986aff 40%, #c879ff 60% )',
              border: '2px solid #000',
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
                  border: '2px solid #000',
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
                  border: '2px solid #000',
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
    <AppShell grads={grads} navItems={navItems}>
      <Box style={{ margin: '0 0 6px 10px' }}>
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
          names={grads.map((grad) => grad.attributes.FullName)}
          slug={slug}
        />
      </Card>
    </AppShell>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
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

  return {
    props: {
      gallery: data[0].attributes,
      galleryPhotoTags: photoTags.data,
      grads: grads.data,
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
    return {
      params: {
        slug: gallery.attributes.Event.data?.attributes.Slug,
        state: gallery.attributes.Event.data?.attributes.State.toLowerCase(),
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default Events;
