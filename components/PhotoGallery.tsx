import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import { useMutation } from '@apollo/client';
import { Loader, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import Clarifai from 'clarifai';
import Image from 'next/image';
import { useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import {
  ChevronLeft,
  ChevronRight,
  FaceId,
  FaceIdError,
  MoodHappy,
  Tags,
  TagsOff,
} from 'tabler-icons-react';
import Lightbox from 'yet-another-react-lightbox';

import { CREATE_PHOTO_TAGS } from '../graphql/mutations/photoTags';
import { revalidateGallery } from '../lib/triggerRevalidate';
import { FaceBoxAttributes } from '../types/FaceBoxes';
import {
  FaceDetectionRegion,
  FaceDetectionResponse,
  GalleryPhoto,
  ParsedPhoto,
} from '../types/Gallery';
import { getTrueImageDimensions } from '../utils/getTrueImageDimensions';
import FaceBoxes from './FaceBoxes';
import NextJsImage from './NextjsImage';

export interface FaceDetectionBox {
  bottom: number;
  left: number;
  right: number;
  top: number;
  name: string;
}
interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  galleryPhotoTags: FaceBoxAttributes[];
  names: string[];
  slug: string;
}

let faceDetectionApp;

const PhotoGallery = ({
  photos,
  galleryPhotoTags,
  names,
  slug,
}: PhotoGalleryProps) => {
  // State
  const [slideIndex, setSlideIndex] = useState<number>(-1);
  const [faceBoxes, setFaceBoxes] = useState<FaceDetectionBox[]>([]);
  const [createdPhotoTagID, setCreatedPhotoTagID] = useState<string>('');
  const [detectionLoading, setDetectionLoading] = useState<boolean>(false);
  const [noFacesDetected, setNoFacesDetected] = useState<boolean>(false);
  const [newPhotoTags, setNewPhotoTags] = useState<FaceBoxAttributes[]>([]);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  // GraphQL
  const [createPhotoTags] = useMutation(CREATE_PHOTO_TAGS);

  const parsedPhotos: ParsedPhoto[] = photos.map((photo) => {
    const { trueHeight, trueWidth } = getTrueImageDimensions(
      photo.attributes.height,
      photo.attributes.width
    );
    return {
      height: trueHeight,
      width: trueWidth,
      aspectRatio: trueWidth / trueHeight,
      id: photo.id,
      alternativeText: photo.attributes.alternativeText,
      caption: photo.attributes.caption,
      name: photo.attributes.name,
      src: photo.attributes.url,
    };
  });

  const onLightboxAction = (left = true, open = false, index = -1) => {
    let newIndex = -1;
    if (!open) {
      // When user clicks left or right on Light box
      // We need to save a newIndex variable as we cannot rely on useState
      if (slideIndex === 0 && left) {
        newIndex = parsedPhotos.length - 1;
        setSlideIndex(parsedPhotos.length - 1);
      } else if (slideIndex === parsedPhotos.length - 1 && !left) {
        newIndex = 0;
        setSlideIndex(0);
      } else if (left) {
        newIndex = slideIndex - 1;
        setSlideIndex((idx) => idx - 1);
      } else {
        newIndex = slideIndex + 1;
        setSlideIndex((idx) => idx + 1);
      }
      setShowTags(false);
    } else {
      newIndex = index * 1;
      setSlideIndex(index);
    }

    // Each time lightbox slides to a new photo check if Photo Tags exist
    // Combine the existing Face Boxes with the client side created ones
    const preExistingFaceBoxes = galleryPhotoTags
      .concat(newPhotoTags)
      .find((face) => face.attributes.PhotoID === parsedPhotos[newIndex]?.id);
    // If it exists, use the Tags and save the Photo Tag ID
    if (preExistingFaceBoxes) {
      setFaceBoxes(JSON.parse(preExistingFaceBoxes.attributes.FaceBoxes));
      setCreatedPhotoTagID(preExistingFaceBoxes.id);
    } else {
      setFaceBoxes([]);
      setCreatedPhotoTagID('');
      setNoFacesDetected(false);
    }
  };

  const onLightboxClose = () => {
    // When the Lightbox is closed, reset all client side state
    setSlideIndex(-1);
    setFaceBoxes([]);
    setCreatedPhotoTagID('');
    setNoFacesDetected(false);
  };

  const handleFaceDetection = () => {
    if (!faceDetectionApp) {
      faceDetectionApp = new Clarifai.App({
        apiKey: process.env.NEXT_PUBLIC_CLARIFAI_KEY,
      });
    }
    setDetectionLoading(true);
    showNotification({
      id: 'detecting-faces',
      loading: true,
      title: 'Detecting Faces',
      message: 'Detecting all faces in this photo',
      autoClose: false,
      disallowClose: true,
    });
    faceDetectionApp.models
      .predict(Clarifai.FACE_DETECT_MODEL, parsedPhotos[slideIndex].src)
      .then(
        (response: FaceDetectionResponse) => {
          if (!('regions' in response.outputs[0].data)) {
            onNoFacesDetected();
            throw new Error('No Faces Detected');
          }
          const responseFaceBoxes = response.outputs[0].data.regions
            .filter((region: FaceDetectionRegion) => 'region_info' in region)
            .map((region: FaceDetectionRegion) => {
              return {
                top: region.region_info.bounding_box.top_row,
                left: region.region_info.bounding_box.left_col,
                right: region.region_info.bounding_box.right_col,
                bottom: region.region_info.bounding_box.bottom_row,
                name: '',
              };
            });
          if (responseFaceBoxes.length === 0) {
            onNoFacesDetected();
            throw new Error('No Face Regions Detected');
          }
          setDetectionLoading(false);
          setFaceBoxes(responseFaceBoxes);
          setShowTags(true);
          createPhotoTags({
            variables: {
              id: parsedPhotos[slideIndex].id,
              slug: slug,
              faceBoxes: JSON.stringify(JSON.stringify(responseFaceBoxes)),
            },
          }).then((response) => {
            console.log('Created Photo Tags');
            setCreatedPhotoTagID(response.data.createPhotoTag.data.id);
            setNewPhotoTags((prevTags) => [
              ...prevTags,
              {
                id: response.data.createPhotoTag.data.id,
                attributes: {
                  FaceBoxes: JSON.stringify(responseFaceBoxes),
                  PhotoID: parsedPhotos[slideIndex].id,
                },
              },
            ]);
            revalidateGallery('create', slug);
            updateNotification({
              id: 'detecting-faces',
              color: 'green',
              title: 'Successful',
              message: 'Successfully detected faces in photo',
              icon: <FaceId />,
              autoClose: 2000,
            });
          });
        },
        (error: string) => {
          throw new Error(error);
        }
      )
      .catch((error: string) => {
        setDetectionLoading(false);
        console.log(`Clarifai Error: ${error}`);
      });
  };

  const onNoFacesDetected = () => {
    updateNotification({
      id: 'detecting-faces',
      title: 'Error',
      message: 'No faces were detected in this photo',
      autoClose: 3000,
      color: 'red',
      icon: <FaceIdError />,
    });
    createPhotoTags({
      variables: {
        id: parsedPhotos[slideIndex].id,
        slug: slug,
        faceBoxes: JSON.stringify(JSON.stringify({ error: true })),
      },
    }).then((response) => {
      console.log('Created Empty Photo Tags');
      revalidateGallery('create', slug);
      setCreatedPhotoTagID(response.data.createPhotoTag.data.id);
    });
    setNoFacesDetected(true);
  };

  return (
    <>
      <PhotoAlbum
        layout='masonry'
        photos={parsedPhotos}
        spacing={14}
        renderPhoto={NextJsImage}
        columns={(containerWidth) => Math.floor(containerWidth / 400) + 1}
        // eslint-disable-next-line no-unused-vars
        onClick={(event, photo, index) => onLightboxAction(false, true, index)}
      />
      <Lightbox
        slides={parsedPhotos}
        open={slideIndex >= 0}
        index={slideIndex}
        close={onLightboxClose}
        toolbar={{
          buttons: [
            !noFacesDetected && faceBoxes.length === 0 ? (
              detectionLoading ? (
                <Loader
                  key='tag_photo_loading'
                  color='white'
                  size='sm'
                  style={{ margin: '14px 10px 0 0' }}
                />
              ) : (
                <Tooltip
                  key='tag_photo'
                  label='Detect Faces'
                  withArrow
                  zIndex={9999}
                >
                  <FaceId
                    size={28}
                    style={{ cursor: 'pointer', margin: '10px 10px 0 0' }}
                    onClick={handleFaceDetection}
                  />
                </Tooltip>
              )
            ) : !showTags ? (
              <div key='enabled_tags'>
                <Tooltip
                  key='show_all_tags'
                  label={showAllTags ? 'Hide Tags' : 'Show Tags'}
                  withArrow
                  zIndex={9999}
                >
                  <MoodHappy
                    size={28}
                    style={{ cursor: 'pointer', margin: '10px 22px 0 0' }}
                    onClick={() => setShowAllTags((prev) => !prev)}
                  />
                </Tooltip>
                <Tooltip
                  key='show_tags'
                  label='Edit Tags'
                  withArrow
                  zIndex={9999}
                >
                  <Tags
                    size={28}
                    style={{ cursor: 'pointer', margin: '10px 10px 0 0' }}
                    onClick={() => setShowTags(true)}
                  />
                </Tooltip>
              </div>
            ) : (
              <Tooltip
                key='hide_tags'
                label='Tagging Off'
                withArrow
                zIndex={9999}
              >
                <TagsOff
                  size={28}
                  style={{ cursor: 'pointer', margin: '10px 10px 0 0' }}
                  onClick={() => setShowTags(false)}
                />
              </Tooltip>
            ),
            'close',
          ],
        }}
        render={{
          iconPrev: () => {
            return <ChevronLeft size={40} onClick={() => onLightboxAction()} />;
          },
          iconNext: () => {
            return (
              <ChevronRight size={40} onClick={() => onLightboxAction(false)} />
            );
          },
          slide: (image) => {
            return (
              <div
                style={{
                  position: 'relative',
                  width: parsedPhotos[slideIndex].width,
                  height: parsedPhotos[slideIndex].height,
                }}
              >
                <Image
                  src={image.src ?? ''}
                  layout='fill'
                  loading='lazy'
                  objectFit='contain'
                  alt={'alt' in image ? image.alt : ''}
                  sizes={`${parsedPhotos[slideIndex].width}`}
                />
                <FaceBoxes
                  faceBoxes={Array.isArray(faceBoxes) ? faceBoxes : []}
                  createdPhotoTagID={createdPhotoTagID}
                  setFaceBoxes={setFaceBoxes}
                  slug={slug}
                  selectedPhoto={parsedPhotos[slideIndex]}
                  showTags={showTags}
                  showAllTags={showAllTags}
                  names={names}
                />
              </div>
            );
          },
        }}
      />
    </>
  );
};

export default PhotoGallery;
