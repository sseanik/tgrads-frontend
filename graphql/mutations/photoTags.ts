import { gql } from '@apollo/client';

export const CREATE_PHOTO_TAGS = gql`
  mutation CreatePhotoTag(
    $id: String!
    $slug: String!
    $faceBoxes: JSON!
    $State: ENUM_PHOTOTAG_STATE
  ) {
    createPhotoTag(
      data: {
        PhotoID: $id
        GallerySlug: $slug
        FaceBoxes: $faceBoxes
        State: $State
      }
    ) {
      data {
        id
        attributes {
          PhotoID
          GallerySlug
          FaceBoxes
          State
        }
      }
    }
  }
`;

export const UPDATE_PHOTO_TAGS = gql`
  mutation UpdatePhotoTag(
    $id: ID!
    $photoID: String!
    $slug: String!
    $faceBoxes: JSON!
    $state: ENUM_PHOTOTAG_STATE
  ) {
    updatePhotoTag(
      id: $id
      data: {
        PhotoID: $photoID
        GallerySlug: $slug
        FaceBoxes: $faceBoxes
        State: $state
      }
    ) {
      data {
        id
        attributes {
          PhotoID
          GallerySlug
          FaceBoxes
          State
        }
      }
    }
  }
`;
