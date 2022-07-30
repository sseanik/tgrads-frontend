import { gql } from '@apollo/client';

export const UPDATE_PHOTO_CAPTION = gql`
  mutation UpdatePhotoCaption($id: ID!, $caption: String!, $alt: String!) {
    updateFileInfo(id: $id, info: { caption: $caption, alternativeText: $alt }) {
      data {
        id
        attributes {
          caption
          alternativeText
        }
      }
    }
  }
`;
