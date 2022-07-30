import { useMutation } from '@apollo/client';
import { Autocomplete, Popover, Tooltip, UnstyledButton } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import { AlertCircle, FaceId } from 'tabler-icons-react';

import { UPDATE_PHOTO_TAGS } from '../graphql/mutations/photoTags';
// import { revalidateGallery } from '../lib/triggerRevalidate';
import { FaceBoxAttributes, FaceDetectionBox } from '../types/FaceBoxes';
import { ParsedPhoto } from '../types/Gallery';

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

let tagIncrement = 0;

const FaceBoxes = (props: FaceBoxesProps) => {
  const [updatePhotoTags, updatedPhotoTags] = useMutation(UPDATE_PHOTO_TAGS);

  const router = useRouter();
  const state = router.query.state as string;

  const submitFaceTag = (name: string, faceBoxIndex: number) => {
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
      props.setFaceBoxes((prevFaceBoxes) =>
      prevFaceBoxes.map((faceBox, idx) =>
        idx === faceBoxIndex ? { ...faceBox, name: name } : faceBox
      )
    );
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
        // revalidateGallery('update', props.slug);
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

  const calculateFaceBoxes = (faceBox: FaceDetectionBox) => {
    return {
      left: faceBox.left * props.width,
      top: faceBox.top * props.height,
      right: props.width - faceBox.right * props.width,
      bottom: props.height - faceBox.bottom * props.height,
    };
  };

  const EditMenu = forwardRef<
    HTMLDivElement,
    { faceBox: FaceDetectionBox; faceBoxIndex: number }
  >(({ faceBox, faceBoxIndex }, ref) => (
    <div
      ref={ref}
      style={{
        ...calculateFaceBoxes(faceBox),
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
