import { gql } from '@apollo/client';

export const QUERY_ALL_NAMES = gql`
  query AllNames {
    grads(pagination: { limit: 100 }, publicationState: PREVIEW) {
      data {
        attributes {
          FirstName
          LastName
        }
      }
    }
  }
`;
