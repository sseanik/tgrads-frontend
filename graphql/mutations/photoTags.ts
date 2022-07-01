import { gql } from '@apollo/client';

export const CREATE_PHOTO_TAGS = gql`
  mutation CreatePhotoTag($id: String!, $slug: String!, $faceBoxes: JSON!) {
    createPhotoTag(
      data: { PhotoID: $id, GallerySlug: $slug, FaceBoxes: $faceBoxes }
    ) {
      data {
        id
        attributes {
          PhotoID
          GallerySlug
          FaceBoxes
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
  ) {
    updatePhotoTag(
      id: $id
      data: { PhotoID: $photoID, GallerySlug: $slug, FaceBoxes: $faceBoxes }
    ) {
      data {
        id
        attributes {
          PhotoID
          GallerySlug
          FaceBoxes
        }
      }
    }
  }
`;
