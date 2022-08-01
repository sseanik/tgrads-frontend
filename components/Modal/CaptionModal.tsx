import { useMutation } from '@apollo/client';
import { Button, Center, Modal, Text, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertCircle, TextRecognition } from 'tabler-icons-react';

import { UPDATE_PHOTO_CAPTION } from '../../graphql/mutations/uploadPhoto';
import { ParsedPhoto } from '../../types/Gallery';

interface CaptionModalProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  currentPhoto: ParsedPhoto | undefined;
  setSavedPhotos: Dispatch<SetStateAction<ParsedPhoto[]>>;
}

const CaptionModal = (props: CaptionModalProps) => {
  // GraphQL Mutation to update the selected photo's caption
  const [updatePhotoCaption] = useMutation(UPDATE_PHOTO_CAPTION);
  // State to track the user submitting a caption update
  const [uploading, setUploading] = useState<boolean>(false);
  // Router used to get the current URL path
  const router = useRouter();

  // When user clicks the submit button, update the photo's caption
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    showNotification({
      id: 'updating-caption',
      loading: true,
      title: 'Updating Caption',
      message: 'Updating photo caption',
      autoClose: false,
      disallowClose: true,
    });
    updatePhotoCaption({
      variables: {
        id: props.currentPhoto?.id,
        caption: props.value,
        alt: router.asPath,
      },
    })
      .then(() => {
        setUploading(false);
        updateNotification({
          id: 'updating-caption',
          color: 'green',
          title: 'Successful',
          message: 'Successfully updated photo caption',
          icon: <TextRecognition />,
          autoClose: 2000,
        });
        // Update the parsed save photos with the new caption
        props.setSavedPhotos((prevPhotos) => {
          const newPhotos = prevPhotos.map((photo) => {
            if (photo.id === props.currentPhoto?.id) {
              return {
                ...photo,
                description: props.value,
              };
            }
            return photo;
          });
          return newPhotos;
        });
      })
      .catch((e) => {
        setUploading(false);
        updateNotification({
          id: 'updating-caption',
          title: 'Error',
          message: `Error: ${e.message}`,
          autoClose: 3000,
          color: 'red',
          icon: <AlertCircle />,
        });
      });
  };

  return (
    <Modal
      style={{ marginLeft: '14px' }}
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={
        <Text weight={700} size='lg'>
          Edit Caption
        </Text>
      }
      zIndex={9999}
      overlayColor='black'
      overlayOpacity={0.4}
    >
      <form onSubmit={onSubmit}>
        <TextInput
          required
          description='Photo Caption'
          mb={10}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        />
        <Center>
          <Button
            size='md'
            mt={4}
            style={{ width: '100%' }}
            type='submit'
            color='indigo'
            loading={uploading}
          >
            Submit
          </Button>
        </Center>
      </form>
    </Modal>
  );
};

export default CaptionModal;
