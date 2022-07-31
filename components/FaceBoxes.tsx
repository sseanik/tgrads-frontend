import { useMutation } from '@apollo/client';
import { Autocomplete, Popover, Tooltip, UnstyledButton } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import { AlertCircle, FaceId } from 'tabler-icons-react';

import { UPDATE_PHOTO_TAGS } from '../graphql/mutations/photoTags';
import { FaceBoxAttributes, FaceDetectionBox } from '../types/FaceBoxes';
import { ParsedPhoto } from '../types/Gallery';
import { calculateFaceBoxes } from '../utils/calculateFaceBoxes';

interface FaceBoxesProps {
  faceBoxes: FaceDetectionBox[];
  createdPhotoTagID: string;
  setFaceBoxes: Dispatch<SetStateAction<FaceDetectionBox[]>>;
  setPhotosAndTags: Dispatch<SetStateAction<FaceBoxAttributes[]>>;
  slug: string;
  selectedPhoto?: ParsedPhoto;
  editingTags: boolean;
  showNameTags: boolean;
  names: string[];
  width: number;
  height: number;
}

let tagIncrement = 0; // global variable for tag ID

const FaceBoxes = (props: FaceBoxesProps) => {
  // GraphQL mutation to update the tags of a photo
  const [updatePhotoTags, updatedPhotoTags] = useMutation(UPDATE_PHOTO_TAGS);
  // Router to get state from the URL
  const router = useRouter();
  const state = router.query.state as string;

  const submitFaceTag = (name: string, faceBoxIndex: number) => {
    // If the user has not allowed for a current operation to finish
    if (updatedPhotoTags.loading) {
      showNotification({
        id: 'tag-face-error',
        title: 'Error',
        message: 'Wait until current tag has finished',
        autoClose: 3000,
        color: 'orange',
        icon: <AlertCircle />,
      });
    } else {
      // Set the face boxes to the new state
      props.setFaceBoxes((prevFaceBoxes) =>
        prevFaceBoxes.map((faceBox, idx) =>
          idx === faceBoxIndex ? { ...faceBox, name: name } : faceBox
        )
      );
      // Use increment variable to track notifications
      const increment = tagIncrement + 1;
      tagIncrement++;
      showNotification({
        id: `updating-face-tag-${increment}`,
        loading: true,
        title: 'Tagging',
        message: `Tagging ${name} in photo`,
        autoClose: false,
        disallowClose: true,
      });
      updatePhotoTags({
        variables: {
          id: props.createdPhotoTagID,
          photoID: props.selectedPhoto?.id,
          slug: props.slug,
          faceBoxes: JSON.stringify(
            JSON.stringify(
              props.faceBoxes.map((faceBox, idx) =>
                idx === faceBoxIndex ? { ...faceBox, name: name } : faceBox
              )
            )
          ),
          state: state.toUpperCase(),
        },
      }).then((response) => {
        // Update the array of all photos and their tags with edited name
        const responsePhotoAndTag = response.data.updatePhotoTag.data;
        props.setPhotosAndTags((prevPhotosAndTags) =>
          prevPhotosAndTags.map((photoAndTag) => {
            return photoAndTag.id === responsePhotoAndTag.id
              ? responsePhotoAndTag
              : photoAndTag;
          })
        );
        updateNotification({
          id: `updating-face-tag-${increment}`,
          color: 'green',
          title: 'Successful',
          message: `Successfully tagged ${name}`,
          icon: <FaceId />,
          autoClose: 2000,
        });
      });
    }
  };

  const EditMenu = forwardRef<
    HTMLDivElement,
    { faceBox: FaceDetectionBox; faceBoxIndex: number }
  >(({ faceBox, faceBoxIndex }, ref) => (
    <div
      ref={ref}
      style={{
        ...calculateFaceBoxes(faceBox, props.width, props.height),
        position: 'absolute',
        boxShadow: props.editingTags
          ? '0 0 0 3px rgba(255, 255, 255, 0.5) inset'
          : '',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: (faceBox.right - faceBox.left) * props.width,
      }}
    >
      <Popover width={200} position='bottom' withArrow shadow='md' trapFocus>
        <Popover.Target>
          <UnstyledButton
            style={{
              width: (faceBox.right - faceBox.left) * props.width,
              height: '100%',
              cursor: props.editingTags ? 'pointer' : 'default',
            }}
          />
        </Popover.Target>
        {props.editingTags && (
          <Popover.Dropdown p={0}>
            <Autocomplete
              initiallyOpened={true}
              data-autofocus
              placeholder='Tag Person'
              required
              data={props.names}
              defaultValue={faceBox.name}
              size='sm'
              radius='sm'
              onItemSubmit={(e) => submitFaceTag(e.value, faceBoxIndex)}
              filter={(value, item) =>
                item.value.toLowerCase().startsWith(value.toLowerCase())
              }
            />
          </Popover.Dropdown>
        )}
      </Popover>
    </div>
  ));

  EditMenu.displayName = 'EditMenu';

  return (
    <>
      {props.faceBoxes.map((faceBox, faceBoxIndex) => {
        return (
          <Tooltip
            key={`face-${faceBoxIndex}`}
            events={{ hover: true, focus: false, touch: true }}
            opened={props.showNameTags ? props.showNameTags : undefined}
            label={faceBox.name}
            withArrow
            position='bottom'
            zIndex={12000}
            disabled={props.editingTags || faceBox.name === ''}
          >
            <EditMenu faceBox={faceBox} faceBoxIndex={faceBoxIndex} />
          </Tooltip>
        );
      })}
    </>
  );
};

export default FaceBoxes;
