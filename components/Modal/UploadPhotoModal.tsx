import {
  Button,
  LoadingOverlay,
  Modal,
  Text,
  useMantineTheme,
} from '@mantine/core';
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

const UploadPhotoModal = ({
  opened,
  setOpened,
  slug,
  galleryID
}: UploadPhotoModalProps) => {
  const theme = useMantineTheme();
  const [images, setImages] = useState<File[]>([]);
  const [visible, setVisible] = useState(false);
  const router = useRouter()

  const handleUploadPhotos = () => {
    setVisible(true);
    showNotification({
      id: `uploading-photos`,
      loading: true,
      title: 'Uploading',
      message: `Uploading ${images.length} photo${
        images.length > 1 ? 's' : ''
      }`,
      autoClose: false,
      disallowClose: true,
    });

    Promise.all(
      images.map((image) => {
        const formData = new FormData();
        formData.append('files', image, image.name);
        formData.append('path', slug);
        formData.append('ref', 'api::gallery.gallery');
        formData.append('refId', galleryID);
        formData.append('field', 'Photos');
        formData.append('fileInfo', JSON.stringify({ caption: slug }));
        return fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/`, {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
      })
    )
      .then((res) => {
        console.log(res);
        updateNotification({
          id: 'uploading-photos',
          color: 'green',
          title: 'Successfully uploaded photos',
          message: 'Successfully uploaded photos',
          icon: <Photo />,
          autoClose: 2000,
        });
        setImages([]);
        setVisible(false);
        setOpened(false);
        router.reload()
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
        setVisible(false);
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text weight={700} size='lg'>
          Upload Photos
        </Text>
      }
      size='md'
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={visible} />
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
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          {(status) =>
            ImageDropzone({ status, theme, imageCount: images.length })
          }
        </Dropzone>
        <Button color='indigo' mt={16} fullWidth onClick={handleUploadPhotos}>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default UploadPhotoModal;
