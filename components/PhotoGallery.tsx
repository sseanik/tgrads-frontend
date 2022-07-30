import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';

import { useMutation } from '@apollo/client';
import { ActionIcon, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import Clarifai from 'clarifai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import {
  ChevronLeft,
  ChevronRight,
  FaceId,
  FaceIdError,
  ZoomIn,
  ZoomOut,
} from 'tabler-icons-react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import { CREATE_PHOTO_TAGS } from '../graphql/mutations/photoTags';
// import { revalidateGallery } from '../lib/triggerRevalidate';
import { FaceBoxAttributes, FaceDetectionBox } from '../types/FaceBoxes';
import {
  FaceDetectionRegion,
  FaceDetectionResponse,
  GalleryPhoto,
  ParsedPhoto,
} from '../types/Gallery';
import { calcResponsiveDimensions } from '../utils/calcResponsiveDimensions';
import { getTrueImageDimensions } from '../utils/getTrueImageDimensions';
import FaceBoxes from './FaceBoxes';
import DisplayTags from './LightboxToolbar/DisplayTags';
import EditCaption from './LightboxToolbar/EditCaption';
import EditTags from './LightboxToolbar/EditTags';
import FaceDetection from './LightboxToolbar/FaceDetection';
import NextJsImage from './NextJsImage';

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  photosAndTags: FaceBoxAttributes[];
  setPhotosAndTags: Dispatch<SetStateAction<FaceBoxAttributes[]>>;
  names: string[];
  slug: string;
}

let faceDetectionApp;

const PhotoGallery = ({
  photos,
  photosAndTags,
  setPhotosAndTags,
  names,
  slug,
}: PhotoGalleryProps) => {
  /* ----------------------------- PHOTO SELECTION ---------------------------- */
  // Index of selected photo from gallery or lightbox slide action
  const [slideIndex, setSlideIndex] = useState<number>(-1);

  /* ------------------------------- FACE BOXES ------------------------------- */
  // Face Boxes state of the current photo
  const [faceBoxes, setFaceBoxes] = useState<FaceDetectionBox[]>([]);

  /* ------------------------- ON DETECT FACES ACTION ------------------------- */
  // Boolean to track when face detection action is in progress
  const [detectionLoading, setDetectionLoading] = useState<boolean>(false);
  // Photo Tags ID of created face detection action
  const [createdPhotoTagID, setCreatedPhotoTagID] = useState<string>('');
  // Boolean to track when no faces were detected
  const [noFacesDetected, setNoFacesDetected] = useState<boolean>(false);

  /* ---------------------------- LIGHTBOX TOOLBOX ---------------------------- */
  // Track when user is editing photo tags
  const [editingTags, setEditingTags] = useState<boolean>(false);
  // Track when user is showing name tags
  const [showNameTags, setShowNameTags] = useState<boolean>(false);
  // Track when toolbox icon is hovered
  const [iconHover, setIconHover] = useState<string>('');

  /* --------------------------------- GRAPHQL -------------------------------- */
  // GraphQL mutation to create photo tags
  const [createPhotoTags] = useMutation(CREATE_PHOTO_TAGS);

  const router = useRouter();
  const state = router.query.state as string;

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
      ...(photo.attributes.caption !== photo.attributes.name &&
        photo.attributes.caption !== '' && {
          description: photo.attributes.caption,
        }),
      name: photo.attributes.name,
      src: photo.attributes.url,
    };
  });

  const [savedPhotos, setSavedPhotos] = useState<ParsedPhoto[]>(parsedPhotos);

  const onSlideAction = (index: number) => {
    setSlideIndex(index);
    setEditingTags(false);
    setAndCheckPreExistingTags(index);
    setShowNameTags(false);
    setNoFacesDetected(false);
  };

  const onLightboxAction = (left = true, open = false, index = -1) => {
    let newIndex = -1;
    if (!open) {
      // When user clicks left or right on Light box
      // We need to save a newIndex variable as we cannot rely on useState
      if (slideIndex === 0 && left) {
        newIndex = savedPhotos.length - 1;
        setSlideIndex(savedPhotos.length - 1);
      } else if (slideIndex === savedPhotos.length - 1 && !left) {
        newIndex = 0;
        setSlideIndex(0);
      } else if (left) {
        newIndex = slideIndex - 1;
        setSlideIndex((idx) => idx - 1);
      } else {
        newIndex = slideIndex + 1;
        setSlideIndex((idx) => idx + 1);
      }
      setEditingTags(false);
    } else {
      newIndex = index * 1;
      setSlideIndex(index);
    }

    setAndCheckPreExistingTags(newIndex);
  };

  const setAndCheckPreExistingTags = (index: number) => {
    // Each time lightbox slides to a new photo check if Photo Tags exist
    // Combine the existing Face Boxes with the client side created ones
    const preExistingFaceBoxes = photosAndTags.find(
      (face) => face.attributes.PhotoID === savedPhotos[index]?.id
    );
    // If it exists, use the Tags and save the Photo Tag ID
    if (preExistingFaceBoxes) {
      let parsedFaceBoxes;
      if (typeof preExistingFaceBoxes.attributes.FaceBoxes === 'string') {
        parsedFaceBoxes = JSON.parse(preExistingFaceBoxes.attributes.FaceBoxes);
      } else {
        parsedFaceBoxes = preExistingFaceBoxes.attributes.FaceBoxes;
      }
      if (!Array.isArray(parsedFaceBoxes)) {
        setNoFacesDetected(true);
      }
      setFaceBoxes(parsedFaceBoxes);
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
      .predict(Clarifai.FACE_DETECT_MODEL, savedPhotos[slideIndex].src)
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
          setFaceBoxes(responseFaceBoxes);
          setEditingTags(true);
          updateNotification({
            id: 'detecting-faces',
            loading: true,
            title: 'Creating Photo Tags',
            message: 'Creating tag boxes for all faces in photo',
            autoClose: false,
            disallowClose: true,
          });
          createPhotoTags({
            variables: {
              id: savedPhotos[slideIndex].id,
              slug: slug,
              faceBoxes: JSON.stringify(JSON.stringify(responseFaceBoxes)),
              state: state.toUpperCase(),
            },
          })
            .then((response) => {
              setDetectionLoading(false);
              setCreatedPhotoTagID(response.data.createPhotoTag.data.id);
              // Update the array of all photos and with new photo with empty tags
              setPhotosAndTags((prevPhotos) => [
                ...prevPhotos,
                {
                  id: response.data.createPhotoTag.data.id,
                  attributes: {
                    FaceBoxes: JSON.stringify(responseFaceBoxes),
                    PhotoID: savedPhotos[slideIndex].id,
                  },
                },
              ]);
              // revalidateGallery('create', slug);
              updateNotification({
                id: 'detecting-faces',
                color: 'green',
                title: 'Successful',
                message: 'Successfully detected faces in photo',
                icon: <FaceId />,
                autoClose: 2000,
              });
            })
            .catch((e) => console.log(e));
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
    createPhotoTags({
      variables: {
        id: savedPhotos[slideIndex].id,
        slug: slug,
        faceBoxes: JSON.stringify(JSON.stringify({ error: true })),
        state: state.toUpperCase(),
      },
    }).then((response) => {
      setCreatedPhotoTagID(response.data.createPhotoTag.data.id);
      setPhotosAndTags((prevPhotos) => [
        ...prevPhotos,
        {
          id: response.data.createPhotoTag.data.id,
          attributes: {
            FaceBoxes: JSON.stringify({ error: true }),
            PhotoID: savedPhotos[slideIndex].id,
          },
        },
      ]);
      // revalidateGallery('create', slug);
      updateNotification({
        id: 'detecting-faces',
        title: 'Error',
        message: 'No faces were detected in this photo',
        autoClose: 3000,
        color: 'red',
        icon: <FaceIdError />,
      });
    });
    setNoFacesDetected(true);
  };

  return (
    <>
      <PhotoAlbum
        layout='masonry'
        photos={savedPhotos}
        spacing={14}
        renderPhoto={NextJsImage}
        columns={(containerWidth) => Math.floor(containerWidth / 400) + 1}
        // eslint-disable-next-line no-unused-vars
        onClick={(event, photo, index) => onLightboxAction(false, true, index)}
      />
      <Lightbox
        slides={savedPhotos}
        open={slideIndex >= 0}
        index={slideIndex}
        close={onLightboxClose}
        plugins={[Zoom, Captions]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        captions={{
          descriptionTextAlign: 'center',
          descriptionMaxLines: 1,
        }}
        on={{
          view: (index: number) => onSlideAction(index),
        }}
        toolbar={{
          buttons: [
            <EditCaption
              key='edit_caption'
              setIconHover={setIconHover}
              iconHover={iconHover}
              setSavedPhotos={setSavedPhotos}
              currentPhoto={savedPhotos.find(
                (photo, index) => index === slideIndex
              )}
            />,
            !noFacesDetected && faceBoxes.length === 0 && (
              <FaceDetection
                key='face_detection'
                detectionLoading={detectionLoading}
                setIconHover={setIconHover}
                handleFaceDetection={handleFaceDetection}
                iconHover={iconHover}
              />
            ),
            !noFacesDetected && faceBoxes.length > 0 && !editingTags && (
              <DisplayTags
                key='display_tags'
                showNameTags={showNameTags}
                setIconHover={setIconHover}
                setShowNameTags={setShowNameTags}
                iconHover={iconHover}
              />
            ),
            !noFacesDetected && faceBoxes.length > 0 && (
              <EditTags
                key='edit_tags'
                editingTags={editingTags}
                setIconHover={setIconHover}
                setEditingTags={setEditingTags}
                iconHover={iconHover}
              />
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
          iconZoomIn: () => {
            return (
              <Tooltip key='zoom_in' label='Zoom In' withArrow zIndex={9999}>
                <ActionIcon
                  component='div'
                  variant='transparent'
                  style={{
                    cursor: 'pointer',
                    margin: '4px 2px 0 0',
                    color: iconHover === 'ZoomIn' ? 'white' : '#cfcfcf',
                  }}
                >
                  <ZoomIn
                    size={28}
                    onMouseOver={() => setIconHover('ZoomIn')}
                    onMouseLeave={() => setIconHover('')}
                  />
                </ActionIcon>
              </Tooltip>
            );
          },
          iconZoomOut: () => {
            return (
              <Tooltip key='zoom_out' label='Zoom Out' withArrow zIndex={9999}>
                <ActionIcon
                  component='div'
                  variant='transparent'
                  style={{
                    cursor: 'pointer',
                    margin: `4px ${noFacesDetected ? 0 : '12px'} 0 0`,
                    color: iconHover === 'ZoomOut' ? 'white' : '#cfcfcf',
                  }}
                >
                  <ZoomOut
                    size={28}
                    onMouseOver={() => setIconHover('ZoomOut')}
                    onMouseLeave={() => setIconHover('')}
                  />
                </ActionIcon>
              </Tooltip>
            );
          },
          slide: (image) => {
            const { width, height } = calcResponsiveDimensions(
              savedPhotos[slideIndex].width,
              savedPhotos[slideIndex].height
            );
            return (
              <div
                style={{
                  position: 'relative',
                  width: width,
                  height: height,
                }}
              >
                <Image
                  src={image.src ?? ''}
                  layout='fill'
                  loading='lazy'
                  objectFit='contain'
                  alt={'alt' in image ? image.alt : ''}
                />
                <FaceBoxes
                  faceBoxes={Array.isArray(faceBoxes) ? faceBoxes : []}
                  createdPhotoTagID={createdPhotoTagID}
                  setFaceBoxes={setFaceBoxes}
                  setPhotosAndTags={setPhotosAndTags}
                  slug={slug}
                  selectedPhoto={savedPhotos[slideIndex]}
                  editingTags={editingTags}
                  showNameTags={showNameTags}
                  names={names}
                  width={width}
                  height={height}
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
