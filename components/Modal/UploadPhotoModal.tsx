import { Button, Modal, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';

import ImageDropzone from '../ImageDropzone';

interface UploadPhotoModalProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  slug: string;
}

const UploadPhotoModal = ({ opened, setOpened, slug }: UploadPhotoModalProps) => {
  const theme = useMantineTheme();
  const [images, setImages] = useState<File[]>([]);

  const handleUploadPhotos = async () => {
    const formData = new FormData();
    images.forEach((image) => formData.append('files', image));
    formData.append('ref', 'api::gallery.gallery');
    formData.append('path', slug)
    formData.append('refId', '8');
    formData.append('field', 'Photos');

    console.log(formData);
    await axios({
      url: 'http://localhost:1337/api/upload/',
      method: 'POST',
      data: formData,
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
        {(status) => ImageDropzone(status, theme)}
      </Dropzone>
      <Button color='indigo' mt={16} fullWidth onClick={handleUploadPhotos}>
        Submit
      </Button>
      {/* <form>
        <input
          type='file'
          name='files'
          onChange={(e) => {
            console.log(e.target.files[0]);
            const formData = new FormData();
            formData.append('files', e.target.files[0]);
            console.log(formData);
          }}
        />
        <input type='submit' value='Submit' />
      </form> */}
    </Modal>
  );
};

export default UploadPhotoModal;
