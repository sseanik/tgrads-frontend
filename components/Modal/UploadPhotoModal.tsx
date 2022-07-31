import { Button, LoadingOverlay, Modal, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertCircle, Photo } from 'tabler-icons-react';

import ImageDropzone from '../ImageDropzone';

interface UploadPhotoModalProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  slug: string;
  galleryID: string;
}

const UploadPhotoModal = (props: UploadPhotoModalProps) => {
  // Image files user would like to upload
  const [images, setImages] = useState<File[]>([]);
  // Loading state for when images are uploading
  const [loading, setLoading] = useState(false);
  // Use router to get the state from URL
  const router = useRouter();
  const state = router.query.state as string;

  const handleUploadPhotos = () => {
    setLoading(true);
    showNotification({
      id: `uploading-photos`,
      loading: true,
      title: 'Uploading',
      message: `Uploading ${images.length} photo${
        images.length > 1 ? 's' : '' // Change string based on number of images
      }`,
      autoClose: false,
      disallowClose: true,
    });

    // Upload each image one by one
    Promise.all(
      images.map((image) => {
        // Create form data to provide image attributes to the API
        const formData = new FormData();
        formData.append('files', image, image.name);
        formData.append('path', `${state.toUpperCase()}/${props.slug}`); // DOES NOT WORK
        formData.append('ref', 'api::gallery.gallery');
        formData.append('refId', props.galleryID);
        formData.append('field', 'Photos');
        formData.append(
          'fileInfo',
          JSON.stringify({
            caption: props.slug,
            alternativeText: `/${state.toLowerCase()}/gallery/${props.slug}`,
          })
        );
        return fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/`, {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
      })
    )
      .then(() => {
        updateNotification({
          id: 'uploading-photos',
          color: 'green',
          title: 'Successfully uploaded photos',
          message: 'Successfully uploaded photos',
          icon: <Photo />,
          autoClose: 2000,
        });
        setImages([]);
        setLoading(false);
        props.setOpened(false);
        router.reload();
      })
      .catch((e) => {
        showNotification({
          id: 'image-upload-error',
          title: 'Error',
          message: 'Upload failed: ' + e.message,
          autoClose: 3000,
          color: 'red',
          icon: <AlertCircle />,
        });
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={
        <Text weight={700} size='lg'>
          Upload Photos
        </Text>
      }
      size='md'
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Dropzone
          onDrop={(files) => setImages(files)}
          onReject={() => {
            showNotification({
              id: 'image-upload-error',
              title: 'Error',
              message: 'Files rejected, not images',
              autoClose: 3000,
              color: 'orange',
              icon: <AlertCircle />,
            });
          }}
          accept={IMAGE_MIME_TYPE}
        >
          <ImageDropzone imageCount={images.length} />
        </Dropzone>
        <Button color='indigo' mt={16} fullWidth onClick={handleUploadPhotos}>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default UploadPhotoModal;
