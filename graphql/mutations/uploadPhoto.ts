import { gql } from '@apollo/client';

export const UPLOAD_PHOTOS = gql`
  mutation ($file: UploadFileInput!) {
    createUploadFile(data: $file) {
      data {
        id
      }
    }
  }
`;
