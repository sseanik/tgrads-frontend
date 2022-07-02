import { gql } from '@apollo/client';

export const QUERY_PHOTO_TAGS = gql`
  query GalleryPhotoTags($slug: String!) {
    photoTags(
      filters: { GallerySlug: { eq: $slug } }
      publicationState: PREVIEW
      pagination: { limit: 1000 }
    ) {
      data {
        id
        attributes {
          FaceBoxes
          PhotoID
        }
      }
    }
  }
`;

export const QUERY_SPECIFIC_PHOTO_TAGS = gql`
  query SpecificGalleryPhotoTags($id: ID!) {
    photoTags(
      filters: { id: { eq: $id } }
      publicationState: PREVIEW
      pagination: { limit: 1000 }
    ) {
      data {
        id
        attributes {
          FaceBoxes
          PhotoID
        }
      }
    }
  }
`;
