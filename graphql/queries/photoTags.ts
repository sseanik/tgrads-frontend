import { gql } from '@apollo/client';

export const QUERY_PHOTO_TAGS = (slug: string | string[] | undefined) => {
  return gql`
    query GalleryPhotoTags {
      photoTags(
        filters: { GallerySlug: { eq: "${slug}" } }
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
};
